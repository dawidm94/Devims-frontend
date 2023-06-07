import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MobileIconComponent } from './mobile-icon.component';

describe('MobileIconComponent', () => {
  let component: MobileIconComponent;
  let fixture: ComponentFixture<MobileIconComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MobileIconComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MobileIconComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
