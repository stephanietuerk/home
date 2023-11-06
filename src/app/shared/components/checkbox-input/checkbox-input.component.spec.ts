import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormatForIdPipe } from '../../pipes/format-for-id/format-for-id.pipe';
import { CheckboxInputComponent } from './checkbox-input.component';

describe('CheckboxComponent', () => {
  let component: CheckboxInputComponent;
  let fixture: ComponentFixture<CheckboxInputComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CheckboxInputComponent, FormatForIdPipe],
      providers: [FormatForIdPipe],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CheckboxInputComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
