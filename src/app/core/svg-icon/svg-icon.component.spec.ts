import { SvgIconComponent } from './svg-icon.component';
import { ComponentFixture, async, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('SvgIconComponent', () => {
    let component: SvgIconComponent;
    let fixture: ComponentFixture<SvgIconComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [SvgIconComponent],
            schemas: [NO_ERRORS_SCHEMA]
        }).compileComponents();

        fixture = TestBed.createComponent(SvgIconComponent);
        component = fixture.componentInstance;
    }));

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    describe('the get absUrl function', () => {
        it('should get a url of the current window', () => {
            expect(component.absUrl).toBe(window.location.href);
        });
    });
});
