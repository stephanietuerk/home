import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JobsByFieldComponent } from './jobs-by-field.component';

describe('JobsByFieldComponent', () => {
  let component: JobsByFieldComponent;
  let fixture: ComponentFixture<JobsByFieldComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ JobsByFieldComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(JobsByFieldComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
