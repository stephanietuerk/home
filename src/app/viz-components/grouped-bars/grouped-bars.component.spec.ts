/* eslint-disable  @typescript-eslint/no-explicit-any */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { XyChartComponent } from '../xy-chart/xy-chart.component';
import { GroupedBarsComponent } from './grouped-bars.component';

describe('GroupedBarsComponent', () => {
  let component: GroupedBarsComponent;
  let fixture: ComponentFixture<GroupedBarsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [GroupedBarsComponent],
      providers: [XyChartComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GroupedBarsComponent);
    component = fixture.componentInstance;
  });

  describe('setMethodsFromConfigAndDraw()', () => {
    beforeEach(() => {
      spyOn(component, 'setValueArrays');
      spyOn(component, 'initNonQuantitativeDomains');
      spyOn(component, 'setValueIndicies');
      spyOn(component, 'setHasBarsWithNegativeValues');
      spyOn(component, 'initUnpaddedQuantitativeDomain');
      spyOn(component, 'setQuantitativeDomainPadding');
      spyOn(component, 'initCategoryScale');
      spyOn(component, 'setScaledSpaceProperties');
      spyOn(component, 'setGroupScale');
      spyOn(component, 'drawMarks');
      component.chart = { transitionDuration: 200 } as any;
      component.setMethodsFromConfig();
    });

    it('calls setValueArrays once', () => {
      expect(component.setValueArrays).toHaveBeenCalledTimes(1);
    });

    it('calls initNonQuantitativeDomains once', () => {
      expect(component.initNonQuantitativeDomains).toHaveBeenCalledTimes(1);
    });

    it('calls setValueArrayIndicies once', () => {
      expect(component.setValueIndicies).toHaveBeenCalledTimes(1);
    });

    it('calls setHasBarsWithNegativeValues once', () => {
      expect(component.setHasBarsWithNegativeValues).toHaveBeenCalledTimes(1);
    });

    it('calls initUnpaddedQuantitativeDomain once', () => {
      expect(component.initUnpaddedQuantitativeDomain).toHaveBeenCalledTimes(1);
    });

    it('calls setQuantitativeDomainPadding once', () => {
      expect(component.setQuantitativeDomainPadding).toHaveBeenCalledTimes(1);
    });

    it('calls setScaledSpaceProperties once', () => {
      expect(component.setChartScales).toHaveBeenCalledTimes(1);
    });

    it('calls setGroupScale once', () => {
      expect(component.setGroupScale).toHaveBeenCalledTimes(1);
    });

    it('calls drawMarks once with the correct argument', () => {
      expect(component.drawMarks).toHaveBeenCalledOnceWith(200);
    });
  });
});
