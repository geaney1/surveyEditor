import { Component, inject, Input } from '@angular/core';
import { Router } from '@angular/router';
import { Survey } from '../models/survey';
import { QuestionCardComponent } from '../question-card/question-card.component';

@Component({
  selector: 'app-survey-card',
  standalone: true,
  imports: [QuestionCardComponent],
  templateUrl: './survey-card.component.html',
  styleUrl: './survey-card.component.scss',
})
export class SurveyCardComponent {
  @Input() survey!: Survey;
  private router = inject(Router);
  readonly title = 'Add  Survey';

  /**
   * Navigate to survey update page with survey data
   */
  onSubmit(surveyId: string | null): void {
    if (surveyId === undefined || surveyId == null) {
      return;
    }
    this.router.navigate([`/survey-update/:${surveyId}`], {
      state: { survey: this.survey, isAddNewSurvey: false },
    });
  }
}
