import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
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
  //readonly userToken = this.authService.getToken();
  survey = new Survey;
  isAddNewSurvey = true; // set to false if updating a new survey
  private fb = inject(FormBuilder);
  updateSurveyForm!: FormGroup;
  submissionSuccess = false;
  submissionError = '';
  showQuestionForm = false;
  updateTitle = 'Add Survey';

  ngOnInit(): void {
    this.updateSurveyForm = this.fb.group({
      title: ['', [Validators.minLength(3)]],
      description: ['', [Validators.minLength(0)]],
    });
    this.route.queryParamMap.subscribe((params) => {
      const id = params.get('id');
      if (id) {
        this.updateTitle = 'Update Survey';
          this.isAddNewSurvey = false;
          this.loadSurveyById(id as string);
        }
      });
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
        this.survey = data;
        const title = this.survey.title ? this.survey.title : '';
        const description = this.survey.description ? this.survey.description : '';
        this.updateSurveyForm = this.fb.group({
          title: [title, [Validators.minLength(3)]],
          description: [description, [Validators.minLength(0)]],
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
        this.updateSurveyForm.reset();
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
