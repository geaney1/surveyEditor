import { Component, Input } from '@angular/core';
import { Question } from '../models/survey';

@Component({
  selector: 'app-question-card',
  standalone: true,
  imports: [],
  templateUrl: './question-card.component.html',
  styleUrl: './question-card.component.scss'
})
export class QuestionCardComponent {
  @Input() question: Question | undefined;
  readonly title = 'Question Details'; 
}
