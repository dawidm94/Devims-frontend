import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EsorComponent } from './esor.component';

describe('EsorComponent', () => {
  let component: EsorComponent;
  let fixture: ComponentFixture<EsorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EsorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EsorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
