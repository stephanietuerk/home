import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LeavingComponent } from './leaving.component';

describe('LeavingComponent', () => {
  let component: LeavingComponent;
  let fixture: ComponentFixture<LeavingComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LeavingComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LeavingComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
