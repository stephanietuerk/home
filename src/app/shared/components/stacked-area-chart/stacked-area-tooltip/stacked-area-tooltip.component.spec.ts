import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StackedAreaTooltipComponent } from './stacked-area-tooltip.component';

describe('StackedAreaTooltipComponent', () => {
  let component: StackedAreaTooltipComponent;
  let fixture: ComponentFixture<StackedAreaTooltipComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StackedAreaTooltipComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StackedAreaTooltipComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
