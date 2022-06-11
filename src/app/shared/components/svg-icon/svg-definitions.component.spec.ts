import { ComponentFixture, async, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { SvgDefinitionsComponent } from './svg-definitions.component';

describe('SvgDefinitionsComponent', () => {
    let component: SvgDefinitionsComponent;
    let fixture: ComponentFixture<SvgDefinitionsComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [SvgDefinitionsComponent],
            schemas: [NO_ERRORS_SCHEMA]
        }).compileComponents();

        fixture = TestBed.createComponent(SvgDefinitionsComponent);
        component = fixture.componentInstance;
    }));

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
