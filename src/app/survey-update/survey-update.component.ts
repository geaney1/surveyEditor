import { Component, inject, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SurveyService } from '../services/survey.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Question, Survey } from '../models/survey';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-survey-update',
  imports: [ReactiveFormsModule],
  templateUrl: './survey-update.component.html',
  styleUrl: './survey-update.component.scss',
})
export class SurveyUpdateComponent implements OnInit {
  @Input() survey?: Survey | null;

  private route = inject(ActivatedRoute);
  private fb = inject(FormBuilder);
  private surveyService = inject(SurveyService);
  updateSurveyForm!: FormGroup;
  submissionSuccess = false;
  submissionError = '';
  isAddNewSurvey = false; // set to true if adding a new survey

  ngOnInit(): void {
    if (this.survey) {
      this.updateSurveyForm = this.fb.group({
        id: [this.survey.id, [Validators.required, Validators.minLength(3)]],
        title: [this.survey.title, [Validators.minLength(3)]],
        description: [this.survey.description, [Validators.minLength(10)]],
        questions: [null, [Validators.min(0)]],
      });
    } else {
      this.isAddNewSurvey = true;
      this.updateSurveyForm = this.fb.group({
        id: ['', [Validators.required, Validators.minLength(3)]],
        title: ['Survey Title', [Validators.minLength(3)]],
        description: ['Survey Description', [Validators.minLength(10)]],
        questions: [null, [Validators.min(0)]],
      });
    }
  }

  get id() {
    return this.updateSurveyForm.get('id');
  }

  get title() {
    return this.updateSurveyForm.get('title');
  }

  get description() {
    return this.updateSurveyForm.get('description');
  }

  onSubmit(): void {
    if (this.updateSurveyForm.invalid) {
      return;
    }
    const question: Question = {
      questionId: 1,
      questionText: 'would you like coffee?',
      mandatoryInd: false,
      questionType: 0,
      options: ['yes', 'no'],
      randomizeOptionsInd: false,
      cards: ['card1', 'card2'],
      programmerNotes: 'notes',
      instructions: 'instructions',
    };
    const selectedSurvey = {
      id: this.updateSurveyForm.value.id,
      title: this.updateSurveyForm.value.title,
      description: this.updateSurveyForm.value.description,
      questions: [question],
    };
    if (this.isAddNewSurvey) {
      this.addNewSurvey(selectedSurvey);
    } else {
      this.modifyExistingSurvey(selectedSurvey);
    }
  }

  /**
   * Modify an existing survey
   */
  modifyExistingSurvey(modifiedSurvey: Survey) {
    this.surveyService.updateSurvey(modifiedSurvey).subscribe({
      next: (survey) => {
        console.log('Survey successfully updateed:', survey);
        this.submissionSuccess = true;
        this.updateSurveyForm.reset();
      },
      error: (err) => {
        console.error('Error updateing existing survey:', err);
        this.submissionError =
          'There was an error updateing existing survey. Please try again.';
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
      next: (survey) => {
        console.log('Survey successfully updateed:', survey);
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
