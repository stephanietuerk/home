import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExploreLineComponent } from './explore-line.component';

describe('ExploreLineComponent', () => {
  let component: ExploreLineComponent;
  let fixture: ComponentFixture<ExploreLineComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExploreLineComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ExploreLineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
