import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SurveyService } from '../services/survey.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Survey } from '../models/survey';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
//import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-survey-update',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatButtonModule,
  ],
  templateUrl: './survey-update.component.html',
  styleUrls: ['./survey-update.component.scss'],
})
export class SurveyUpdateComponent implements OnInit {
  //private authService = inject(AuthService);
  private surveyService = inject(SurveyService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  //readonly userToken = this.authService.getToken();
  survey = new Survey();
  isAddNewSurvey = true; // set to false if updating a new survey
  private fb = inject(FormBuilder);
  updateSurveyForm!: FormGroup;
  submissionSuccess = false;
  submissionError = '';
  showQuestionForm = false;
  updateTitle = 'Add Survey';
  id: string | undefined;

  constructor() {
    // Check if survey was passed via router state (from survey-card)
    const navigation = this.router.getCurrentNavigation();
    console.log('Constructor - navigation:', navigation);
    console.log('Constructor - state:', navigation?.extras?.state);

    if (navigation?.extras?.state) {
      const state = navigation.extras.state as {
        id?: string;
      };
      console.log('State survey:', state.id);

      if (state.id) {
        this.survey.id = state.id;
        this.isAddNewSurvey = false;
        console.log('Survey loaded from router state:', this.survey);
      }
    }
  }

  ngOnInit(): void {
    this.updateSurveyForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', [Validators.required, Validators.minLength(10)]],
    });
    console.log('ngOnInit - survey.id:', this.survey.id);

    // Check for path parameter (e.g., /survey-update/123)
    this.route.paramMap.subscribe((params) => {
      this.survey.id = params.get('id');
      console.log('ngOnInit - Path param ID:', this.survey.id);

      if (this.survey.id) {
        this.updateTitle = 'Update Survey';
        this.isAddNewSurvey = false;
        this.loadSurveyById(this.survey.id as string);
      }
    });

    // If survey was passed via router state, populate the form
    if (this.survey.id) {
      this.updateTitle = 'Update Survey';
      this.updateSurveyForm.patchValue({
        title: this.survey.title,
        description: this.survey.description,
      });
      this.isAddNewSurvey = false;
      console.log('Form populated from router state');
    }
  }

  get title() {
    return this.updateSurveyForm?.get('title');
  }

  get description() {
    return this.updateSurveyForm?.get('description');
  }

  onSubmit(): void {
    if (this.updateSurveyForm.invalid) {
      return;
    }

    // ensure the question index are in order
    if (this.survey?.questions) {
      for (const [index, q] of this.survey.questions.entries()) {
        q.questionId = index + 1;
      }
    }
    const selectedSurvey = {
      id: this.survey.id,
      title:
        this.updateSurveyForm.value.title !== ''
          ? this.updateSurveyForm.value.title
          : null,
      description:
        this.updateSurveyForm.value.description !== ''
          ? this.updateSurveyForm.value.description
          : null,
      questions: this.survey.questions,
    };
    if (this.isAddNewSurvey) {
      this.addNewSurvey(selectedSurvey);
    } else {
      this.modifyExistingSurvey(selectedSurvey);
    }
  }

  /**
   * Load survey by ID from survey.service
   */
  loadSurveyById(id: string): void {
    this.surveyService.getSurveyById(id).subscribe({
      next: (data: Survey) => {
        console.log(data);
        this.survey = data;
        this.updateSurveyForm.patchValue({
          title: this.survey.title,
          description: this.survey.description,
        });
      },
      error: (err: Error) => {
        console.error('Error fetching survey by ID:', err);
      },
    });
  }

  /**
   * Modify an existing survey
   */
  modifyExistingSurvey(modifiedSurvey: Survey) {
    this.surveyService.updateSurvey(modifiedSurvey).subscribe({
      next: () => {
        this.submissionSuccess = true;
        //this.updateSurveyForm.reset();
      },
      error: (err) => {
        console.error('Error updating existing survey:', err);
        this.submissionError =
          'There was an error updating existing survey. Please try again.';
      },
    });
  }

  /**
   * Add a new survey
   */
  addNewSurvey(addNewSurvey: Survey) {
    if (!this.survey) {
      return;
    }
    this.surveyService.addSurvey(addNewSurvey).subscribe({
      next: () => {
        this.submissionSuccess = true;
        this.updateSurveyForm.reset();
      },
      error: (err) => {
        console.error('Error adding new survey:', err);
        this.submissionError =
          'There was an error adding the survey. Please try again.';
      },
    });
  }
}
