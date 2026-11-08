import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConnectedMessageComponent } from './connected-message.component';

describe('RelativeMessageComponent', () => {
  let component: ConnectedMessageComponent;
  let fixture: ComponentFixture<ConnectedMessageComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    fixture = TestBed.createComponent(ConnectedMessageComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
