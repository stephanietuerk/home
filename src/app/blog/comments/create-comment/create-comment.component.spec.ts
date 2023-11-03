import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CreateCommentComponent } from './create-comment.component';

describe('CreateCommentComponent', () => {
  let component: CreateCommentComponent;
  let fixture: ComponentFixture<CreateCommentComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CreateCommentComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateCommentComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
