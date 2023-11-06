import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormatForIdPipe } from '../../pipes/format-for-id/format-for-id.pipe';
import { RadioInputComponent } from './radio-input.component';

describe('RadioInputComponent', () => {
  let component: RadioInputComponent;
  let fixture: ComponentFixture<RadioInputComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RadioInputComponent, FormatForIdPipe],
      providers: [FormatForIdPipe],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RadioInputComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
