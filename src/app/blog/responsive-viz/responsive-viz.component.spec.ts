import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResponsiveVizComponent } from './responsive-viz.component';

describe('ResponsiveVizComponent', () => {
  let component: ResponsiveVizComponent;
  let fixture: ComponentFixture<ResponsiveVizComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ResponsiveVizComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ResponsiveVizComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
