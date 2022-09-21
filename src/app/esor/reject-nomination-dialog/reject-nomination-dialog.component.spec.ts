import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RejectNominationDialogComponent } from './reject-nomination-dialog.component';

describe('RejectNominationDialogComponent', () => {
  let component: RejectNominationDialogComponent;
  let fixture: ComponentFixture<RejectNominationDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RejectNominationDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RejectNominationDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
