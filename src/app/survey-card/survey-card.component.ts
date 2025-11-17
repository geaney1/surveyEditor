import { Component, Input } from '@angular/core';
import { Survey } from '../models/survey';
import { QuestionCardComponent } from "../question-card/question-card.component";

@Component({
  selector: 'app-survey-card',
  standalone: true,
  imports: [QuestionCardComponent],
  templateUrl: './survey-card.component.html',
  styleUrl: './survey-card.component.scss',
})
export class SurveyCardComponent {
  @Input() survey!: Survey;
  readonly title = 'Survey Details'; 
}

  /**
   * Set user token from surveyListForm email value
   */
  onSubmit(): void {
    
  }