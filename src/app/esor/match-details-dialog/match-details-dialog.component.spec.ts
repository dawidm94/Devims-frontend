import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MatchDetailsDialogComponent } from './match-details-dialog.component';

describe('MatchDetailsDialogComponent', () => {
  let component: MatchDetailsDialogComponent;
  let fixture: ComponentFixture<MatchDetailsDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MatchDetailsDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MatchDetailsDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
