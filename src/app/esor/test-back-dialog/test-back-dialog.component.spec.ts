import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TestBackDialogComponent } from './test-back-dialog.component';

describe('TestBackDialogComponent', () => {
  let component: TestBackDialogComponent;
  let fixture: ComponentFixture<TestBackDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TestBackDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TestBackDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
