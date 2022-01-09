import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExploreChangeComponent } from './explore-change.component';

describe('ExploreChangeComponent', () => {
  let component: ExploreChangeComponent;
  let fixture: ComponentFixture<ExploreChangeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExploreChangeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ExploreChangeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
