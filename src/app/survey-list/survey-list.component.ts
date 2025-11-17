import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Survey } from '../models/survey';
import { SurveyService } from '../services/survey.service';
import { AuthService } from '../services/auth.service';
import {
  ReactiveFormsModule,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { SurveyCardComponent } from '../survey-card/survey-card.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-survey-list',
  imports: [
    ReactiveFormsModule,
    SurveyCardComponent,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatButtonModule,
  ],
  templateUrl: './survey-list.component.html',
  styleUrl: './survey-list.component.scss',
})
export class SurveyListComponent implements OnInit {
  private authService = inject(AuthService);
  private surveyService = inject(SurveyService);
  private route = inject(ActivatedRoute);
  readonly title = 'Surveys';
  readonly userToken = this.authService.getToken() || '';

  surveyListForm = new FormGroup({
    email: new FormControl(this.userToken, [
      Validators.required,
      Validators.email,
    ]),
  });
  surveys: Survey[] = [];
  submissionSuccess = false;
  submissionError = '';

  ngOnInit(): void {
    let id;
    this.route.queryParamMap.subscribe((params) => {
      id = params.get('id');
    });
    if (this.authService.getToken()) {
      if (id) {
        this.loadSurveyById(id as string);
      } else {
        this.loadSurveys();
      }
    }
  }

  /**
   * Handle email input changes - clear token if email is empty
   */
  onEmailInput(): void {
    const emailValue = this.surveyListForm.get('email')?.value;
    if (!emailValue || emailValue.trim() === '') {
      this.clearEmail();
    }
  }

  /**
   * Clear email and user token
   */
  clearEmail(): void {
    this.surveys = [];
    this.surveyListForm.patchValue({ email: '' });
    //this.authService.clearToken();
  }

  /**
   * Set user token from surveyListForm email value
   */
  onSubmit(): void {
    if (this.surveyListForm.valid) {
      const tk: string = this.surveyListForm.value.email!;
      this.authService.setToken(tk);
      this.loadSurveys();
    }
  }

  /**
   * Load survey by ID from survey.service
   */
  loadSurveyById(id: string): void {
    this.surveyService.getSurveyById(id).subscribe({
      next: (data: Survey) => {
        this.surveys = [data];
      },
      error: (err: Error) => {
        console.error('Error fetching survey by ID:', err);
      },
    });
  }

  /**
   * Load the surveys from the survey service
   */
  loadSurveys(): void {
    this.surveyService.getSurveys().subscribe({
      next: (data: Survey[]) => {
        console.log('Surveys loaded:', data);
        this.surveys = data;
        this.submissionSuccess = true;
        this.submissionError = '';
      },
      error: (err: Error) => {
        console.error('Error loading surveys:', err);
        this.submissionError =
          'There was an error loading surveys. Please try again.';
      },
    });
  }
}
