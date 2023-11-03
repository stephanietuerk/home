import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ContentNavbarComponent } from './content-navbar.component';

describe('ProjectNavbarComponent', () => {
  let component: ContentNavbarComponent;
  let fixture: ComponentFixture<ContentNavbarComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ContentNavbarComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ContentNavbarComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
