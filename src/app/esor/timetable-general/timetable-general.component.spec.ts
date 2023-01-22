import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TimetableGeneralComponent } from './timetable-general.component';

describe('TimetableGeneralComponent', () => {
  let component: TimetableGeneralComponent;
  let fixture: ComponentFixture<TimetableGeneralComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TimetableGeneralComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TimetableGeneralComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
