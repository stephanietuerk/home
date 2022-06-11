import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NG_CONTROL_PROVIDER } from 'src/app/testing/stubs/forms/ng-control-provider.stub';
import { NOOP_VALUE_ACCESSOR } from '../forms.constants';
import { FormSelectComponent } from './form-select.component';

describe('SelectComponent', () => {
    let component: FormSelectComponent;
    let fixture: ComponentFixture<FormSelectComponent>;
    let ngControl;

    beforeEach(async () => {
        ngControl = NG_CONTROL_PROVIDER;
        await TestBed.configureTestingModule({
            declarations: [FormSelectComponent],
        })
            .overrideComponent(FormSelectComponent, {
                add: { providers: [ngControl] },
            })
            .compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(FormSelectComponent);
        component = fixture.componentInstance;
    });

    describe('constructor()', () => {
        it('sets ngControl valueAccessor to NOOP_VALUE_ACCESSOR is ngControl exists', () => {
            expect(component.ngControl.valueAccessor).toEqual(NOOP_VALUE_ACCESSOR);
        });
    });
});
