import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExploreSelectionsNavbarComponent } from './explore-selections-navbar.component';

describe('ExploreSelectionsNavbarComponent', () => {
  let component: ExploreSelectionsNavbarComponent;
  let fixture: ComponentFixture<ExploreSelectionsNavbarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExploreSelectionsNavbarComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ExploreSelectionsNavbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
