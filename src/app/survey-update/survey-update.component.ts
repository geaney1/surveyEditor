import { Component, inject, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SurveyService } from '../services/survey.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Question, Survey } from '../models/survey';
import { ReactiveFormsModule } from '@angular/forms';
import { QuestionCardComponent } from '../question-card/question-card.component';
import { QuestionUpdateComponent } from '../question-update/question-update.component';
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
    QuestionCardComponent,
    QuestionUpdateComponent,
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
  questions: Question[] = [];
  question = new Question();
  showQuestionForm = false;

  ngOnInit(): void {
    if (this.survey.questions) {
      this.questions = this.survey.questions;
    }
    this.updateSurveyForm = this.fb.group({
      id: [this.survey.id, [Validators.required, Validators.minLength(3)]],
      title: [this.survey.title, [Validators.minLength(3)]],
      description: [this.survey.description, [Validators.minLength(10)]],
      questions: [this.questions, [Validators.min(0)]],
    });
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

  /**
   * Add a new question to the survey
   */
  addNewQuestion() {
    this.question = new Question();
    this.showQuestionForm = true;
  }

  onSubmit(): void {
    if (this.updateSurveyForm.invalid) {
      return;
    }

    // ensure the question index are in order
    if (this.questions) {
      for (const [index, q] of this.questions.entries()) {
        q.questionId = index + 1;
      }
    }
    const selectedSurvey = {
      id: this.updateSurveyForm.value.id,
      title: this.updateSurveyForm.value.title,
      description: this.updateSurveyForm.value.description,
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
