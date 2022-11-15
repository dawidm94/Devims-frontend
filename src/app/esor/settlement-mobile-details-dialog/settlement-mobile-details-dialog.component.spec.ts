import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SettlementMobileDetailsDialogComponent } from './settlement-mobile-details-dialog.component';

describe('SettlementMobileDetailsDialogComponent', () => {
  let component: SettlementMobileDetailsDialogComponent;
  let fixture: ComponentFixture<SettlementMobileDetailsDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SettlementMobileDetailsDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SettlementMobileDetailsDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
