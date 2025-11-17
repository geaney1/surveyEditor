import { Component, inject, Input, OnInit } from '@angular/core';
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
  styleUrl: './survey-update.component.scss',
})
export class SurveyUpdateComponent implements OnInit {
  @Input() survey: Survey = new Survey();
  @Input() isAddNewSurvey = true; // set to false if updating a new survey
  private route = inject(ActivatedRoute);
  private fb = inject(FormBuilder);
  private surveyService = inject(SurveyService);
  updateSurveyForm!: FormGroup;
  submissionSuccess = false;
  submissionError = '';
  showQuestionForm = false;

  ngOnInit(): void {
    this.updateSurveyForm = this.fb.group({
      title: [this.survey.title, [Validators.minLength(3)]],
      description: [this.survey.description, [Validators.minLength(0)]],
    });
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

    // ensure the question index are in order
    if (this.survey.questions) {
      for (const [index, q] of this.survey.questions.entries()) {
        q.questionId = index + 1;
      }
    }
    const selectedSurvey = {
      id: this.survey.id,
      title: this.updateSurveyForm.value.title !== '' ? this.updateSurveyForm.value.title : null,
      description: this.updateSurveyForm.value.description !== '' ? this.updateSurveyForm.value.description : null,
      questions: this.survey.questions,
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
        console.log('Survey successfully updated:', survey);
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
      next: (survey) => {
        console.log('Survey successfully updated:', survey);
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
