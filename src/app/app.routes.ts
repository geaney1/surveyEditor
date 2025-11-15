import { Routes } from '@angular/router';
import { SurveyListComponent } from './survey-list/survey-list.component';
import { SurveyUpdateComponent } from './survey-update/survey-update.component';
import { SurveyCardComponent } from './survey-card/survey-card.component';

export const routes: Routes = [
    // Our two main routes:
    { path: '', redirectTo: 'surveys', pathMatch: 'full' },
    { path: 'surveys', component: SurveyListComponent },
    { path: 'surveys/:id', component: SurveyCardComponent },
    { path: 'survey-update', component: SurveyUpdateComponent } 
  ];
