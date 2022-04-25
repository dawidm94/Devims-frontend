import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BusyTimesComponent } from './busy-times.component';

describe('BusyTimesComponent', () => {
  let component: BusyTimesComponent;
  let fixture: ComponentFixture<BusyTimesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BusyTimesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BusyTimesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
