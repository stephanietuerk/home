simport { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { async, from } from 'rxjs';
import { ContentNavbarComponent } from './content-navbar.component';

describe('ProjectNavbarComponent', () => {
  let component: ContentNavbarComponent;
  let fixture: ComponentFixture<ContentNavbarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContentNavbarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContentNavbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
