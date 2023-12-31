import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormCheckboxInputComponent } from './form-checkbox-input.component';

describe('FormCheckboxInputComponent', () => {
  let component: FormCheckboxInputComponent;
  let fixture: ComponentFixture<FormCheckboxInputComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FormCheckboxInputComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FormCheckboxInputComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
