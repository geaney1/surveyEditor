import { Routes } from '@angular/router';
import { SurveyListComponent } from './survey-list/surveyListComponent';
import { SurveyUpdateComponent } from './survey-update/survey-update.component';
import { QuestionUpdateComponent } from './question-update/question-update.component';

export const routes: Routes = [
    // Our two main routes:
    { path: '', redirectTo: 'surveys', pathMatch: 'full' },
    { path: 'surveys', component: SurveyListComponent },
    { path: 'surveys/:id', component: SurveyListComponent },
    { path: 'survey-update', component: SurveyUpdateComponent }, 
    { path: 'survey-update/:id', component: SurveyUpdateComponent }, 
    { path: 'question-update/:id', component: QuestionUpdateComponent }, 
    { path: 'question-update/:id/:questionId', component: QuestionUpdateComponent } 
  ];
