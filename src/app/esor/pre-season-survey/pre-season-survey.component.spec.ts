import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PreSeasonSurveyComponent } from './pre-season-survey.component';

describe('PreSeasonSurveyComponent', () => {
  let component: PreSeasonSurveyComponent;
  let fixture: ComponentFixture<PreSeasonSurveyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PreSeasonSurveyComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PreSeasonSurveyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
