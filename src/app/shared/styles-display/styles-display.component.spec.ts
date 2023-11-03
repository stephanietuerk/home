import { ComponentFixture, TestBed } from '@angular/core/testing';
import { StylesDisplayComponent } from './styles-display.component';

describe('StylesDisplayComponent', () => {
  let component: StylesDisplayComponent;
  let fixture: ComponentFixture<StylesDisplayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [StylesDisplayComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StylesDisplayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
