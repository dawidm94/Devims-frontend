import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EsorHomeComponent } from './esor-home.component';

describe('EsorHomeComponent', () => {
  let component: EsorHomeComponent;
  let fixture: ComponentFixture<EsorHomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EsorHomeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EsorHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
