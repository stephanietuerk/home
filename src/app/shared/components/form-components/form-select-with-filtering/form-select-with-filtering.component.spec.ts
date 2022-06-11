import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { NG_CONTROL_PROVIDER } from 'src/app/testing/stubs/forms/ng-control-provider.stub';
import { NOOP_VALUE_ACCESSOR } from '../forms.constants';
import { FormSelectWithFilteringComponent } from './form-select-with-filtering.component';

describe('SelectWithFilteringComponent', () => {
    let component: FormSelectWithFilteringComponent;
    let fixture: ComponentFixture<FormSelectWithFilteringComponent>;
    let ngControl;

    beforeEach(async () => {
        ngControl = NG_CONTROL_PROVIDER;
        await TestBed.configureTestingModule({
            declarations: [FormSelectWithFilteringComponent],
            imports: [MatAutocompleteModule],
        })
            .overrideComponent(FormSelectWithFilteringComponent, {
                add: { providers: [ngControl] },
            })
            .compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(FormSelectWithFilteringComponent);
        component = fixture.componentInstance;
    });

    describe('constructor()', () => {
        it('sets ngControl valueAccessor to NOOP_VALUE_ACCESSOR is ngControl exists', () => {
            expect(component.ngControl.valueAccessor).toEqual(NOOP_VALUE_ACCESSOR);
        });
    });

    describe('ngOnChanges()', () => {
        beforeEach(() => {
            spyOn(component, 'updateFilterOptionsForInput');
        });

        describe('if there are changes to options', () => {
            it('calls updateFilterOptionsForInput', () => {
                component.ngOnChanges({ options: ['hi'] } as any);
                expect(component.updateFilterOptionsForInput).toHaveBeenCalledTimes(1);
            });
        });

        describe('if there are not changes to options', () => {
            it('does not call updateFilterOptionsForInput', () => {
                component.ngOnChanges({} as any);
                expect(component.updateFilterOptionsForInput).not.toHaveBeenCalled();
            });
        });
    });

    describe('updateFilterOptionsForInput()', () => {
        it('calls filterOptionsByInputValue once and with the correct parameter for each new input value emitted', () => {
            spyOn(component, 'filterOptionsByInputValue');
            component.updateFilterOptionsForInput();
            component.filteredOptions.subscribe((data) => {
                console.log(data);
            });
            component.ngControl.control.setValue('hello');
            expect(component.filterOptionsByInputValue).toHaveBeenCalledTimes(2);
            expect(component.filterOptionsByInputValue).toHaveBeenCalledWith('hello');
        });
        it('calls filterOptionsByInputValue once for each time filterOptions is updated and sets filterOptions to the correct value', () => {
            spyOn(component, 'filterOptionsByInputValue').and.returnValue(['hello']);
            component.updateFilterOptionsForInput();
            component.filteredOptions
                .subscribe((data) => {
                    expect(component.filterOptionsByInputValue).toHaveBeenCalledOnceWith('');
                    expect(data).toEqual(['hello']);
                })
                .unsubscribe();
        });
    });

    describe('filterOptionsByInputValue()', () => {
        let normalizeSpy: jasmine.Spy;
        let optionIncludesSpy: jasmine.Spy;
        beforeEach(() => {
            component.options = ['one', 'two'];
            normalizeSpy = spyOn(component, 'normalizeValue');
            optionIncludesSpy = spyOn(component, 'optionIncludesInputValue');
            normalizeSpy.and.returnValue('norm str');
        });

        it('calls normalizeValue once and with the correct value', () => {
            component.filterOptionsByInputValue('str');
            expect(component.normalizeValue).toHaveBeenCalledOnceWith('str');
        });

        it('calls optionIncludesInputValue once for each item in options and with the correct parameters', () => {
            component.filterOptionsByInputValue('str');
            expect(component.optionIncludesInputValue).toHaveBeenCalledTimes(2);
            expect(optionIncludesSpy.calls.allArgs()).toEqual([
                ['one', 'norm str'],
                ['two', 'norm str'],
            ]);
        });
    });

    describe('optionIncludesInputValue()', () => {
        let normalizeSpy: jasmine.Spy;
        beforeEach(() => {
            normalizeSpy = spyOn(component, 'normalizeValue');
            normalizeSpy.and.returnValue('opt');
        });

        it('calls normalizeValue once and with the correct parameter', () => {
            component.optionIncludesInputValue('Opt', 'val');
            expect(component.normalizeValue).toHaveBeenCalledOnceWith('Opt');
        });

        it('integration: returns true if normalized option includes inputValue', () => {
            normalizeSpy.and.returnValue('value');
            const result = component.optionIncludesInputValue('Opt', 'val');
            expect(result).toEqual(true);
        });

        it('integration: returns false if normalized option does not include inputValue', () => {
            normalizeSpy.and.returnValue('option');
            const result = component.optionIncludesInputValue('Opt', 'val');
            expect(result).toEqual(false);
        });
    });

    describe('integration: normalizeValue()', () => {
        it('lower cases input string', () => {
            const result = component.normalizeValue('OPT');
            expect(result).toEqual('opt');
        });

        it('removes spaces from input string', () => {
            const result = component.normalizeValue('O Pt');
            expect(result).toEqual('opt');
        });
    });
});
