import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NG_CONTROL_PROVIDER } from 'src/app/testing/forms/ng-control-provider.stub';
import { NOOP_VALUE_ACCESSOR } from '../forms.constants';
import { FormRadioInputComponent } from './form-radio-input.component';

describe('FormRadioInputComponent', () => {
  let component: FormRadioInputComponent;
  let fixture: ComponentFixture<FormRadioInputComponent>;
  let ngControl;

  beforeEach(async () => {
    ngControl = NG_CONTROL_PROVIDER;
    await TestBed.configureTestingModule({
      declarations: [FormRadioInputComponent],
    })
      .overrideComponent(FormRadioInputComponent, {
        add: { providers: [ngControl] },
      })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FormRadioInputComponent);
    component = fixture.componentInstance;
  });

  describe('setting the value of _uniqueId', () => {
    it('defines _uniqueId to a a number', () => {
      expect(isNaN(component._uniqueId)).toEqual(false);
    });
  });

  describe('constructor()', () => {
    it('sets ngControl valueAccessor to NOOP_VALUE_ACCESSOR is ngControl exists', () => {
      expect(component.ngControl.valueAccessor).toEqual(NOOP_VALUE_ACCESSOR);
    });
  });

  describe('ngOnInit()', () => {
    beforeEach(() => {
      spyOn(component, 'setUniqueId');
      spyOn(component, 'parseOption');
      spyOn(component, 'setSelected');
      spyOn(component, 'setFormListener');
    });

    it('calls setUniqueId once', () => {
      component.ngOnInit();
      expect(component.setUniqueId).toHaveBeenCalledTimes(1);
    });

    it('calls setUniqueId once', () => {
      component.ngOnInit();
      expect(component.parseOption).toHaveBeenCalledTimes(1);
    });

    it('calls setSelected once', () => {
      component.ngOnInit();
      expect(component.setSelected).toHaveBeenCalledTimes(1);
    });

    it('calls setFormListener once', () => {
      component.ngOnInit();
      expect(component.setFormListener).toHaveBeenCalledTimes(1);
    });
  });

  describe('setFormListener', () => {
    let setSelectedSpy: jasmine.Spy;
    beforeEach(() => {
      setSelectedSpy = spyOn(component, 'setSelected');
      spyOn(
        component.ngControl.control.valueChanges,
        'subscribe'
      ).and.callThrough();
    });
    it('subscribes to valueChanges', () => {
      component.setFormListener();
      expect(
        component.ngControl.control.valueChanges.subscribe
      ).toHaveBeenCalledTimes(1);
    });

    it('calls setSelected once for each time the value of test changes', () => {
      component.setFormListener();
      component.ngControl.control.setValue('test');
      component.ngControl.control.setValue('test 2');
      expect(component.setSelected).toHaveBeenCalledTimes(2);
    });

    it('integration: does not call setSelected after unsubscribe has called next and complete', () => {
      component.setFormListener();
      component.unsubscribe.next();
      component.unsubscribe.complete();
      setSelectedSpy.calls.reset();
      component.ngControl.control.setValue('test');
      expect(component.setSelected).toHaveBeenCalledTimes(0);
    });
  });

  describe('setUniqueId()', () => {
    describe('if id is defined', () => {
      it('sets uniqueId to the correct value', () => {
        component.id = 'test';
        component.setUniqueId();
        expect(component.uniqueId).toEqual('test');
      });
    });

    describe('if id is not defined', () => {
      it('sets uniqueId to the correct value', () => {
        component._uniqueId = 12;
        component.setUniqueId();
        expect(component.uniqueId).toEqual('smt-radio-input-12');
      });
    });
  });

  describe('parseOption()', () => {
    beforeEach(() => {
      component.option = { label: 'labeling', value: 'valuing' };
    });

    it('sets label to option.label', () => {
      component.parseOption();
      expect(component.label).toEqual('labeling');
    });

    it('sets value to option.value if option.value exists', () => {
      component.parseOption();
      expect(component.value).toEqual('valuing');
    });

    it('sets value to option.label if option.value does not exist', () => {
      component.option = { label: 'labeling' };
      component.parseOption();
      expect(component.value).toEqual('labeling');
    });
  });

  describe('setSelected()', () => {
    it('sets this selected to true is control.value equals component.value', () => {
      component.ngControl.control.setValue('works');
      component.value = 'works';
      component.setSelected();
      expect(component.selected).toEqual(true);
    });

    it('sets this selected to false is control.value does not equal component.value', () => {
      component.ngControl.control.setValue('works');
      component.value = 'not works';
      component.setSelected();
      expect(component.selected).toEqual(false);
    });
  });

  describe('the getIconName function', () => {
    describe('if isStyledRadio is true', () => {
      beforeEach(() => {
        component.isStyledRadio = true;
      });

      it('returns radio-selected if option.selected is true', () => {
        component.selected = true;
        expect(component.getIconName()).toBe('radio-selected');
      });

      it('returns radio-unselected if option.selected is false', () => {
        component.selected = false;
        expect(component.getIconName()).toBe('radio-unselected');
      });
    });

    describe('if isStyledRadio is false', () => {
      beforeEach(() => {
        component.isStyledRadio = false;
      });

      it('returns radio-unselected if option.selected is false', () => {
        expect(component.getIconName()).toBe('radio-unselected');
      });
    });
  });

  describe('ngOnDestroy', () => {
    beforeEach(() => {
      spyOn(component.unsubscribe, 'next');
      spyOn(component.unsubscribe, 'complete');
    });

    it('calls component.unsubscribe.next', () => {
      component.ngOnDestroy();
      expect(component.unsubscribe.next).toHaveBeenCalledTimes(1);
    });

    it('calls component.unsubscribe.complete', () => {
      component.ngOnDestroy();
      expect(component.unsubscribe.complete).toHaveBeenCalledTimes(1);
    });
  });
});
