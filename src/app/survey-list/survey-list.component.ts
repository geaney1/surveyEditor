import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Survey } from '../models/survey';
import { SurveyService } from '../services/survey.service';
//import { SurveyCardComponent } from '../survey-card/survey-card.component';
import { AuthService } from '../services/auth.service';
import {
  ReactiveFormsModule,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';

@Component({
  selector: 'app-survey-list',
  imports: [ReactiveFormsModule],
  templateUrl: './survey-list.component.html',
  styleUrl: './survey-list.component.scss',
})
export class SurveyListComponent implements OnInit {
  private authService = inject(AuthService);
  private surveyService = inject(SurveyService);
  private route = inject(ActivatedRoute);
  readonly title = 'Surveys';
  readonly userToken = this.authService.getToken() || '';

  form = new FormGroup({
    email: new FormControl(this.userToken, [
      Validators.required,
      Validators.email,
    ]),
  });
  surveys: Survey[] = [];
  submissionSuccess= false;
  submissionError = '';
  desc: string | null = null;

  ngOnInit(): void {
    this.route.queryParamMap.subscribe((params) => {
      this.desc = params.get('description');
    });
    if (this.authService.getToken()){ // if email is entered then load surveys 
      this.loadSurveys();
    }
  }

  /**
   * Clear email and user token
   */
  clearEmail() {
    this.form.patchValue({ email: '' });
    this.authService.clearToken();
  }

  /**
   * Set user token from form email value
   */
  onSubmit() {
    if (this.form.valid) {
      const tk: string = this.form.value.email!;

      this.authService.setToken(tk);
      this.loadSurveys();
    }
  }

  /**
   * Load the surveys from the survey service
   */
  loadSurveys() {
    this.surveyService.getSurveys(this.desc ?? null).subscribe({
      next: (data: Survey[]) => {
        console.log('Surveys loaded:', data);
        this.surveys = data;
        this.submissionSuccess = true;
        this.submissionError = '';
      },
      error: (err) => {
        console.error('Error loading surveys:', err);
        this.submissionError =
          'There was an error loading surveys. Please try again.';
      },
    });
  }
}
