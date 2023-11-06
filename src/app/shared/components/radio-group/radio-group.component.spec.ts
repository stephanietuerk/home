import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { InputOption } from '../input-option.model';
import { RadioGroupComponent } from './radio-group.component';

describe('RadioGroupComponent', () => {
  let component: RadioGroupComponent;
  let fixture: ComponentFixture<RadioGroupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      declarations: [RadioGroupComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(RadioGroupComponent);
    component = fixture.componentInstance;
  });

  describe('the ngOnInit function', () => {
    it('should call the initializeSelection function', () => {
      spyOn(component, 'initializeSelection');
      component.ngOnInit();
      expect(component.initializeSelection).toHaveBeenCalledTimes(1);
    });
  });

  describe('the conditionalClasses function', () => {
    let option: InputOption;
    beforeEach(() => {
      option = {
        label: 'button',
        selected: true,
      };
      spyOn(component, 'conditionalClassSetter').and.returnValue(['']);
    });
    it('should call conditionalClassSetter', () => {
      component.conditionalClasses(option, 1);
      expect(component.conditionalClassSetter).toHaveBeenCalledTimes(1);
    });
    it("should return array containing class named 'selected' if option is selected", () => {
      expect(component.conditionalClasses(option, 1)).toContain('selected');
    });
  });

  describe('integration: the initializeSelection function', () => {
    let option;
    beforeEach(() => {
      option = { label: 'one', selected: true };
      spyOn(component, 'emitNewSelection');
    });
    it('should call emitNewSelection if selectedOption is truthy', () => {
      component.options = [option, { label: 'two', selected: false }] as any;
      component.initializeSelection();
      expect(component.emitNewSelection).toHaveBeenCalledTimes(1);
      expect(component.emitNewSelection).toHaveBeenCalledWith(option);
    });
  });

  describe('the onSelect function', () => {
    const option = { label: 'one', selected: true };
    beforeEach(() => {
      spyOn(component, 'resetOptionsSelected');
      spyOn(component, 'selectOption');
      spyOn(component, 'emitNewSelection');
      spyOn(component.clicked, 'emit');
    });
    it('should call the resetOptionsSelected function', () => {
      component.onSelect(option);
      expect(component.resetOptionsSelected).toHaveBeenCalledTimes(1);
    });
    it('should call the selectOption function', () => {
      component.onSelect(option);
      expect(component.selectOption).toHaveBeenCalledTimes(1);
      expect(component.selectOption).toHaveBeenCalledWith(option);
    });
    it('should call the emitNewSelection function', () => {
      component.onSelect(option);
      expect(component.emitNewSelection).toHaveBeenCalledTimes(1);
      expect(component.emitNewSelection).toHaveBeenCalledWith(option);
    });
    it('should call the emit method on clicked', () => {
      component.onSelect(option);
      expect(component.clicked.emit).toHaveBeenCalledTimes(1);
    });
  });

  describe('the resetOptionsSelected function', () => {
    it('should set selected for all options to false', () => {
      component.options = [
        { label: 'hm', selected: true },
        { label: 'rf', selected: false },
      ];
      component.resetOptionsSelected();
      expect(component.options[0].selected).toEqual(false);
      expect(component.options[1].selected).toEqual(false);
    });
  });

  describe('the selectOption function', () => {
    it('should set selected for the correct option to true', () => {
      component.options = [
        { label: 'hm', selected: false },
        { label: 'rf', selected: false },
      ];
      component.selectOption(component.options[0]);
      expect(component.options[0].selected).toEqual(true);
    });
  });

  describe('the emitNewSelection function', () => {
    let option;
    beforeEach(() => {
      spyOn(component.newSelection, 'emit');
      option = { label: 'one', selected: true };
    });
    it('should call the emit method on newSelection with the input parameter label if input param has no value', () => {
      component.emitNewSelection(option);
      expect(component.newSelection.emit).toHaveBeenCalledTimes(1);
      expect(component.newSelection.emit).toHaveBeenCalledWith('one' as any);
    });
    it('should call the emit method on newSelection with the input parameter value if input param has value', () => {
      option.value = 'value';
      component.emitNewSelection(option);
      expect(component.newSelection.emit).toHaveBeenCalledTimes(1);
      expect(component.newSelection.emit).toHaveBeenCalledWith('value' as any);
    });
  });
});
