import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SortArrowsComponent } from './sort-arrows.component';

describe('SortArrowsComponent', () => {
  let component: SortArrowsComponent;
  let fixture: ComponentFixture<SortArrowsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SortArrowsComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SortArrowsComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
