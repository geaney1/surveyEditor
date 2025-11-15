import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SurveyUpdateComponent } from './survey-update.component';

describe('SurveyUpdateComponent', () => {
  let component: SurveyUpdateComponent;
  let fixture: ComponentFixture<SurveyUpdateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SurveyUpdateComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SurveyUpdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
