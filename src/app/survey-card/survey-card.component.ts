import { Component, inject, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Survey } from '../models/survey';
import { QuestionCardComponent } from '../question-card/question-card.component';
import { correctQuestionIdOrder } from '../models/shared';

@Component({
  selector: 'app-survey-card',
  standalone: true,
  imports: [QuestionCardComponent],
  templateUrl: './survey-card.component.html',
  styleUrl: './survey-card.component.scss',
})
export class SurveyCardComponent implements OnInit {
  @Input() survey!: Survey;
  private router = inject(Router);
  readonly title = 'Add  Survey';

  ngOnInit(): void {
    // ensure the questionIds  are in order
    if (this.survey.questions) {
      correctQuestionIdOrder(this.survey.questions);
    }
  }

  /**
   * Navigate to survey update page with survey data
   */
  onUpdateSurveySubmit(surveyId: string | null): void {
    if (surveyId === undefined || surveyId == null) {
      return;
    }
    this.router.navigate([`/survey-update/${surveyId}`], {
      state: { id: surveyId },
    });
  }

    /**
   * Add Question
   * Navigate to question update page with survey id
   */
  onAddQuestionSubmit(): void {
    if (this.survey.id === undefined || this.survey.id == null) {
      return;
    }
    this.router.navigate([`/question-update/${this.survey.id}`]);
  }
}
