import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SvgIconOldComponent } from './svg-icon-old.component';

describe('SvgIconComponent', () => {
  let component: SvgIconOldComponent;
  let fixture: ComponentFixture<SvgIconOldComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SvgIconOldComponent],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SvgIconOldComponent);
    component = fixture.componentInstance;
  });

  describe('the get absUrl function', () => {
    it('should get a url of the current window', () => {
      expect(component.absUrl).toBe(window.location.href);
    });
  });
});
