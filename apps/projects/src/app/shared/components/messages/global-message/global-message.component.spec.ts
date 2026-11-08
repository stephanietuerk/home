import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GlobalMessageComponent } from './global-message.component';

describe('GlobalMessageComponent', () => {
  let component: GlobalMessageComponent;
  let fixture: ComponentFixture<GlobalMessageComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    fixture = TestBed.createComponent(GlobalMessageComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
