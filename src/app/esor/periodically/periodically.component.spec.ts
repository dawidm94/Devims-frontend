import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PeriodicallyComponent } from './periodically.component';

describe('PeriodicallyComponent', () => {
  let component: PeriodicallyComponent;
  let fixture: ComponentFixture<PeriodicallyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PeriodicallyComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PeriodicallyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
