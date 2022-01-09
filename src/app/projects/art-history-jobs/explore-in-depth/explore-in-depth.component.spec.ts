import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExploreInDepthComponent } from './explore-in-depth.component';

describe('ExploreInDepthComponent', () => {
  let component: ExploreInDepthComponent;
  let fixture: ComponentFixture<ExploreInDepthComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExploreInDepthComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ExploreInDepthComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
