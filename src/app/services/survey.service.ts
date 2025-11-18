import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, Observable, of, throwError } from 'rxjs';
import { Survey } from '../models/survey';

@Injectable({
  providedIn: 'root',
})
export class SurveyService {
  private http = inject(HttpClient);
  private readonly baseUrl = 'https://techtestapi1.azurewebsites.net/Survey';
  private selectedSurvey: Survey | null = null;

  setSelectedSurvey(Survey: Survey) {
    this.selectedSurvey = Survey;
  }

  getSelectedSurvey(): Survey | null {
    return this.selectedSurvey;
  }

  /**
   * Get all surveys created by the user
   */
  getSurveys(): Observable<Survey[]> {
    return this.http.get<Survey[]>(`${this.baseUrl}`).pipe(
      catchError((error) => {
        console.error('Error getting surveylist', error);
        return of([]);
      })
    );
  }

  /**
   * GET a survey by id
   */
  getSurveyById(surveyId: string): Observable<Survey> {
    return this.http.get<Survey>(`${this.baseUrl}/${surveyId}`).pipe(
      catchError((error) => {
        console.error(`Error getting survey id of ${surveyId}:`, error);
        return of({} as Survey);
      })
    );
  }

  /**
   * Post a new Survey
   */
  addSurvey(survey: Survey): Observable<Survey> {
    return this.http.post<Survey>(`${this.baseUrl}`, survey).pipe(
      catchError((error) => {
        console.error('Error adding survey', error);
        return throwError(() => error);
      })
    );
  }
  /**
   * Put a new Survey
   */
  updateSurvey(survey: Survey): Observable<Survey> {
    return this.http.put<Survey>(`${this.baseUrl}/${survey.id}`, survey).pipe(
      catchError((error) => {
        console.error('Error updating survey', error);
        return throwError(() => error);
      })
    );
  }
}
