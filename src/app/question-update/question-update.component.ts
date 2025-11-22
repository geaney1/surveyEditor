import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { Question, Survey } from '../models/survey';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatOptionModule } from '@angular/material/core';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { SurveyService } from '../services/survey.service';
import { throwError } from 'rxjs';

const questionTypes = [
  { value: 1, viewValue: 'Single Choice' },
  { value: 2, viewValue: 'Multiple Choice' },
  { value: 3, viewValue: 'Straight Line Input' },
  { value: 4, viewValue: 'Dropdown List' },
];

@Component({
  selector: 'app-question-update',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatSelectModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatButtonModule,
    MatSlideToggleModule,
    MatSelectModule,
    MatOptionModule,
  ],
  templateUrl: './question-update.component.html',
  styleUrl: './question-update.component.scss',
})
export class QuestionUpdateComponent implements OnInit {
  private surveyService = inject(SurveyService);
  survey = new Survey();
  question = new Question();
  questionCnt = 1;

  qTypes = questionTypes;
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private fb = inject(FormBuilder);
  isAddNewQuestion = true; // set to false if editing a question
  updateQuestionForm!: FormGroup;
  questionIdStr = 'Q1';

  questText = '';
  randOptionsInd = false;
  manInd = false;
  progNotes = '';
  instruct = '';
  questionCards: string[] = [];
  questionOptions: string[] = [];
  showQuestionForm = false;
  qId: number | null = null;
  id: string | null = null;
  submissionSuccess = false;
  submissionError = '';
  updateTitle = 'Add Question';

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      this.id = params.get('id')!;
      if (this.id) {
        this.survey.id = this.id;
      }
      const qId = params.get('questionId');
      this.qId = qId ? Number(qId) : null;
    });

    this.updateQuestionForm = this.fb.group({
      questionType: [1, [Validators.max(4)]],
      questionText: ['', [Validators.minLength(0)]],
      randomizeOptionsInd: [false],
      mandatoryInd: [false],
      options: [[], [Validators.min(1)]],
      cards: [[], [Validators.min(0)]],
      programmerNotes: ['', [Validators.min(0)]],
      instructions: ['', [Validators.min(0)]],
    });
    // Check if survey was passed via router state (from survey-card)

    //this.id = '6917add9383f5247a64592eb';
    if (this.id) {
      this.loadSurveyByIds(this.id as string);
    }
  }

  get questionText() {
    return this.updateQuestionForm.get('questionText');
  }

  get options() {
    return this.updateQuestionForm.get('options');
  }

  get cards() {
    return this.updateQuestionForm.get('cards');
  }

  get programmerNotes() {
    return this.updateQuestionForm.get('programmerNotes');
  }

  get instructions() {
    return this.updateQuestionForm.get('instructions');
  }

  /**
   * Load survey by ID from survey.service
   */
  loadSurveyByIds(id: string): void {
    this.surveyService.getSurveyById(id).subscribe({
      next: (data: Survey) => {
        this.survey = data;
        if (!this.survey.id) {
          this.survey.id = id;
        }
        if (!this.survey.questions) {
          this.survey.questions = [];
        }
        if (this.qId && this.survey.questions.length >= this.qId) {
          // update question
          this.question = this.survey.questions[this.qId - 1];
          this.questionIdStr = `Q${this.qId}`;
          this.isAddNewQuestion = false;
          this.updateTitle = 'Modify Question';

          this.updateQuestionForm.patchValue({
            questionType: this.question.questionType || 1,
            questionText: this.question.questionText || '',
            randomizeOptionsInd: this.question.randomizeOptionsInd || false,
            mandatoryInd: this.question.mandatoryInd || false,
            options: this.question.options || [],
            cards: this.question.cards || [],
            programmerNotes: this.question.programmerNotes || '',
            instructions: this.question.instructions || '',
          });
        } else {
          //add new question
          this.isAddNewQuestion = true;
          this.updateTitle = 'Add Question';
          this.question.questionId = this.survey.questions.length + 1;
        }
      },
      error: (err: Error) => {
        console.error('Error fetching survey by ID:', err);
        throwError(() => err);
      },
    });
  }

  onQuestionSubmit(): void {
    if (this.updateQuestionForm.invalid) {
      return;
    }
    if (!this.survey.questions) {
      this.survey.questions = [];
    }
    this.question.questionType = this.updateQuestionForm.value.questionType;
    this.question.questionText = this.updateQuestionForm.value.questionText;
    this.question.cards = this.updateQuestionForm.value.cards;
    this.question.options = this.updateQuestionForm.value.options;
    this.question.programmerNotes =
      this.updateQuestionForm.value.programmerNotes;
    this.question.instructions = this.updateQuestionForm.value.instructions;
    this.question.randomizeOptionsInd =
      this.updateQuestionForm.value.randomizeOptionsInd;
    this.question.mandatoryInd = this.updateQuestionForm.value.mandatoryInd;
    if (this.isAddNewQuestion) {
      this.survey.questions.push(this.question);
    } else {
      const index = (this.qId as number) - 1;
      if (index >= 0 && index < this.survey.questions.length) {
        this.survey.questions[index] = this.question;
      }
    }

    if (!this.survey.id) {
      console.error('Survey ID is missing! Cannot update.');
      this.submissionError = 'Survey ID is missing. Cannot update survey.';
      return;
    }

    this.surveyService.updateSurvey(this.survey).subscribe({
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
}
