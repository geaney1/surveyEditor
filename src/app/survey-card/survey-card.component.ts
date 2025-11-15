import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Survey } from '../models/survey';
import { SurveyService } from '../services/survey.service';

@Component({
  selector: 'app-survey-card',
  imports: [],
  templateUrl: './survey-card.component.html',
  styleUrl: './survey-card.component.scss',
})
export class SurveyCardComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private surveyService = inject(SurveyService);
  public survey: Survey | null = null;

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const idStr = params.get('id');
      if (idStr) {
        const id = +idStr;
        this.loadSurveyById(id);
      }
    });
  }

  /**
   * Load survey by ID
   * @param id
   */
  loadSurveyById(id: number): void {
    this.surveyService.getSurveyById(id).subscribe({
      next: (data: Survey) => {
        this.survey = data;
      },
      error: (err) => {
        console.error('Error fetching survey by ID:', err);
      },
    });
  }

  /**
   * Go back to previous page
   */
  goBack(): void {
    window.history.back();
  }
}
