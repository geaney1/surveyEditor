import { Routes } from '@angular/router';
import { SurveyListComponent } from './survey-list/survey-list.component';
import { SurveyUpdateComponent } from './survey-update/survey-update.component';

export const routes: Routes = [
    // Our two main routes:
    { path: '', redirectTo: 'surveys', pathMatch: 'full' },
    { path: 'surveys', component: SurveyListComponent },
    { path: 'surveys/:id', component: SurveyListComponent },
    { path: 'survey-update', component: SurveyUpdateComponent } 
  ];
