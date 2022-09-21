import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AcceptNominationDialogComponent } from './accept-nomination-dialog.component';

describe('AcceptNominationDialogComponent', () => {
  let component: AcceptNominationDialogComponent;
  let fixture: ComponentFixture<AcceptNominationDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AcceptNominationDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AcceptNominationDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
