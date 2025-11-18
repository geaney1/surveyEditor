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
import { ActivatedRoute } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatOptionModule } from '@angular/material/core';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import { AuthService } from '../services/auth.service';
import { SurveyService } from '../services/survey.service';

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
  private authService = inject(AuthService);
  private surveyService = inject(SurveyService);
  private userToken = this.authService.getToken()
  survey = new Survey();
  question = new Question();
  questionCnt = 0;

  qTypes = questionTypes;
  private route = inject(ActivatedRoute);
  private fb = inject(FormBuilder);
  isAddNewQuestion = true; // set to false if editing a question
  updateQuestionForm!: FormGroup;
  questionIdStr = 'Q1';
  questType = 1;
  questText = '';
  randOptionsInd = false;
  manInd = false;
  progNotes = '';
  instruct = '';
  questionCards: string[] = [];
  questionOptions: string[] = [];
  showQuestionForm = false;
  constructor() {
    this.updateQuestionForm = this.fb.group({
      questionText: ['', [Validators.minLength(0)]],
      randomizeOptionsInd: [false],
      mandatoryInd: [false],
      options: [[], [Validators.min(1)]],
      cards: [[], [Validators.min(0)]],
      programmerNotes: ['', [Validators.min(0)]],
      instructions: ['', [Validators.min(0)]],
    });
  }
  ngOnInit(): void {
      this.route.queryParamMap.subscribe((params) => {
        const id = params.get('id');
        if (id) {
          this.isAddNewQuestion = false;
          this.loadSurveyById(id as string);
        } else {
          this.survey = new Survey();
          this.updateQuestionForm = this.fb.group({
            title: [this.survey.title, [Validators.minLength(3)]],
            description: [this.survey.description, [Validators.minLength(0)]],
          });
        }
     // });
    }

  


    /* Set the Question ID */
    if (this.isAddNewQuestion) {
      this.questionIdStr = `Q${this.questionCnt}`;
    } else if (this.question?.questionId) {
      this.questionIdStr = `Q${this.question.questionId}`;
    }

    /*-- set the question Type --*/
    if (this.question?.questionType) {
      this.questType = this.question.questionType;
    }

    /** get the question Text */
    if (this.question?.questionText) {
      this.questText = this.question.questionText;
    }

    /*-- set question options fields --*/
    this.questionOptions = this.question?.options ? this.question.options : [];

    /** set the question cards */
    this.questionCards = this.question?.cards ? this.question.cards : [];

    /** set mandatory options indicator */
    if (this.question?.mandatoryInd) {
      this.manInd = this.question.mandatoryInd as boolean;
    }
    /** set randomize options indicator */
    if (this.question?.randomizeOptionsInd) {
      this.randOptionsInd = this.question.randomizeOptionsInd as boolean;
    }

    /** set the programmer notes */
    if (this.question?.programmerNotes) {
      this.progNotes = this.question.programmerNotes;
    }

    /** set the instruction fields */
    if (this.question?.instructions) {
      this.instruct = this.question.instructions;
    }
/*
    this.updateQuestionForm = this.fb.group({
      questionText: [this.questText, [Validators.minLength(0)]],
      randomizeOptionsInd: [this.randOptionsInd],
      mandatoryInd: [this.manInd],
      options: [this.questionOptions, [Validators.min(1)]],
      cards: [this.questionCards, [Validators.min(0)]],
      programmerNotes: [this.progNotes, [Validators.min(0)]],
      instructions: [this.instruct, [Validators.min(0)]],
    });
*/
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
  loadSurveyById(id: string): void {
    this.surveyService.getSurveyById(id).subscribe({
      next: (data: Survey) => {
        this.survey = data;
        if (!this.survey.title) { this.survey.title = ''; }
        if (!this.survey.description) { this.survey.description = ''; }
        this.updateQuestionForm = this.fb.group({
            title: [this.survey.title, [Validators.minLength(3)]],
            description: [this.survey.description, [Validators.minLength(0)]],
          });
      },
      error: (err: Error) => {
        console.error('Error fetching survey by ID:', err);
      },
    });
  }
}
