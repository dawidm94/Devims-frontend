import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TimetableGeneralAdvancedComponent } from './timetable-general-advanced.component';

describe('TimetableGeneralAdvancedComponent', () => {
  let component: TimetableGeneralAdvancedComponent;
  let fixture: ComponentFixture<TimetableGeneralAdvancedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TimetableGeneralAdvancedComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TimetableGeneralAdvancedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
