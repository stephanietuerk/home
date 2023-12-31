import { ComponentFixture, TestBed } from '@angular/core/testing';
import { VicCategoricalAttributeDataDimensionConfig } from '../../geographies/geographies.config';
import { DiscontinuousLegendComponent } from './discontinuous-legend.component';

describe('DiscontinuousLegendComponent', () => {
  let component: DiscontinuousLegendComponent;
  let fixture: ComponentFixture<DiscontinuousLegendComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DiscontinuousLegendComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DiscontinuousLegendComponent);
    component = fixture.componentInstance;
  });

  describe('ngOnChanges', () => {
    beforeEach(() => {
      spyOn(component, 'setCategoricalValues');
      spyOn(component, 'setValues');
      spyOn(component, 'setColors');
    });

    it('should call setCategoricalValues if isCategorical is true', () => {
      component.isCategorical = true;
      component.ngOnChanges();
      expect(component.setCategoricalValues).toHaveBeenCalledTimes(1);
    });

    it('should call setValues if isCategorical is false', () => {
      component.isCategorical = false;
      component.ngOnChanges();
      expect(component.setValues).toHaveBeenCalledTimes(1);
    });

    it('should call setColors if isCategorical is false', () => {
      component.isCategorical = false;
      component.ngOnChanges();
      expect(component.setColors).toHaveBeenCalledTimes(1);
    });
  });

  describe('setCategoricalValues', () => {
    beforeEach(() => {
      component.config = new VicCategoricalAttributeDataDimensionConfig();
      component.config.domain = ['a', 'b'];
      component.config.range = ['red', 'blue'];
      component.setCategoricalValues();
    });

    it('should set colors to scale.range', () => {
      expect(component.colors).toEqual(['red', 'blue']);
    });

    it('should set values to scale.domain', () => {
      expect(component.values).toEqual(['a', 'b']);
    });

    it('should set startValueSpace to 0', () => {
      expect(component.startValueSpace).toEqual(0);
    });

    it('should set endValueSpace to 0', () => {
      expect(component.endValueSpace).toEqual(0);
    });

    it('should set largerValueSpace to 0', () => {
      expect(component.largerValueSpace).toEqual(0);
    });

    it('should set leftOffset to 0', () => {
      expect(component.leftOffset).toEqual(0);
    });
  });

  describe('getLeftOffset', () => {
    beforeEach(() => {
      component.width = 200;
      component.largerValueSpace = 40;
      component.startValueSpace = 20;
      component.orientation = 'horizontal';
    });

    describe('if orientation is horizontal', () => {
      it('integration: returns the correct value if colorHalfWidth is larger than largerValueSpace', () => {
        const result = component.getLeftOffset([1, 2]);
        expect(result).toEqual(-30);
      });

      it('integration: returns the correct value if colorHalfWidth is smaller than largerValueSpace', () => {
        const result = component.getLeftOffset([1, 2, 3, 4]);
        expect(result).toEqual(-20);
      });
    });

    it('returns 0 if orientation is vertical', () => {
      component.orientation = 'vertical';
      const result = component.getLeftOffset([1, 2]);
      expect(result).toEqual(0);
    });
  });
});
