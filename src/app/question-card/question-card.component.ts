import { Component, Input, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Question } from '../models/survey';

@Component({
  selector: 'app-question-card',
  standalone: true,
  imports: [],
  templateUrl: './question-card.component.html',
  styleUrl: './question-card.component.scss',
})
export class QuestionCardComponent {
  @Input() surveyId: string | undefined;
  @Input() question: Question | undefined;
  readonly title = 'Question Details';
  router = inject(Router);


  /**
   * Modify Question
   * Navigate to question update page with survey id and question id
   */
  onUpdateSubmit(questionId: number): void {
    if (
      this.surveyId === undefined ||
      this.surveyId == null ||
      questionId === undefined ||
      questionId == null
    ) {
      return;
    }
    this.router.navigate([`/question-update/${this.surveyId}/${questionId}`]);
  }
}
