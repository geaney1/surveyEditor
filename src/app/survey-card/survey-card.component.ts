import { Component, Input } from '@angular/core';
import { Survey } from '../models/survey';

@Component({
  selector: 'app-survey-card',
  standalone: true,
  imports: [],
  templateUrl: './survey-card.component.html',
  styleUrl: './survey-card.component.scss',
})
export class SurveyCardComponent {
  @Input() survey!: Survey;
  readonly title = 'Survey Details'; 
}
