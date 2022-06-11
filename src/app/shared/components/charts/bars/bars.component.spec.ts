import { CUSTOM_ELEMENTS_SCHEMA, SimpleChange } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { InternSet } from 'd3';
import { BehaviorSubject } from 'rxjs';
import { UtilitiesService } from 'src/app/core/services/utilities.service';
import { MainServiceStub } from 'src/app/testing/stubs/main.service.stub';
import { ChartComponent } from '../chart/chart.component';
import { XYChartSpaceComponent } from '../xy-chart-space/xy-chart-space.component';
import { BarsComponent } from './bars.component';
import { BarsConfig } from './bars.model';

describe('BarsComponent', () => {
  let component: BarsComponent;
  let fixture: ComponentFixture<BarsComponent>;
  let mainServiceStub: MainServiceStub;

  beforeEach(async () => {
    mainServiceStub = new MainServiceStub();
    await TestBed.configureTestingModule({
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      declarations: [BarsComponent],
      providers: [
        XYChartSpaceComponent,
        ChartComponent,
        {
          provide: UtilitiesService,
          useValue: mainServiceStub.utilitiesServiceStub,
        },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BarsComponent);
    component = fixture.componentInstance;
  });

  describe('ngOnChanges()', () => {
    let configChange: any;
    beforeEach(() => {
      spyOn(component, 'setMethodsFromConfigAndDraw');
      configChange = {
        config: new SimpleChange('', '', false),
      };
    });

    it('should call objectChangedNotFirstTime once and with the correct parameters', () => {
      component.ngOnChanges(configChange);
      expect(
        mainServiceStub.utilitiesServiceStub.objectChangedNotFirstTime
      ).toHaveBeenCalledOnceWith(configChange, 'config');
    });
    it('should call setMethodsFromConfigAndDraw once if objectChangedNotFirstTime returns true', () => {
      mainServiceStub.utilitiesServiceStub.objectChangedNotFirstTime.and.returnValue(
        true
      );
      component.ngOnChanges(configChange);
      expect(component.setMethodsFromConfigAndDraw).toHaveBeenCalledTimes(1);
    });
    it('should call setMethodsFromConfigAndDraw once if objectChangedNotFirstTime returns false', () => {
      mainServiceStub.utilitiesServiceStub.objectChangedNotFirstTime.and.returnValue(
        false
      );
      component.ngOnChanges(configChange);
      expect(component.setMethodsFromConfigAndDraw).toHaveBeenCalledTimes(0);
    });
  });

  describe('ngOnInit()', () => {
    beforeEach(() => {
      spyOn(component, 'subscribeToScales');
    });
    it('should call subscribeToScales once', () => {
      component.ngOnInit();
      expect(component.subscribeToScales).toHaveBeenCalledTimes(1);
    });
  });

  describe('subscribeToScales()', () => {
    beforeEach(() => {
      component.xySpace = {
        xScale: new BehaviorSubject<string>(null),
        yScale: new BehaviorSubject<string>(null),
      } as any;
      component.xySpace.xScale$ = component.xySpace.xScale.asObservable();
      component.xySpace.yScale$ = component.xySpace.yScale.asObservable();
    });
    it('sets xScale to a new value when a new value is emitted from subscription', () => {
      component.subscribeToScales();
      expect(component.xScale).toBeNull();
      component.xySpace.xScale.next('test x');
      expect(component.xScale).toEqual('test x');
    });

    it('sets yScale to a new value when a new value is emitted from subscription', () => {
      component.subscribeToScales();
      expect(component.yScale).toBeNull();
      component.xySpace.yScale.next('test y');
      expect(component.yScale).toEqual('test y');
    });
  });

  describe('resizeMarks()', () => {
    beforeEach(() => {
      spyOn(component, 'setRanges');
      spyOn(component, 'setScaledSpaceProperties');
      spyOn(component, 'drawMarks');
    });
    describe('if values.x and values.y are truthy', () => {
      beforeEach(() => {
        component.values = { x: 1, y: 2 } as any;
        component.resizeMarks();
      });
      it('calls setRanges once', () => {
        expect(component.setRanges).toHaveBeenCalledTimes(1);
      });

      it('calls setScaledSpaceProperties once', () => {
        expect(component.setScaledSpaceProperties).toHaveBeenCalledTimes(1);
      });

      it('calls drawMarks once with zero as the argument', () => {
        expect(component.drawMarks).toHaveBeenCalledOnceWith(0);
      });
    });

    describe('if values.x is falsy', () => {
      beforeEach(() => {
        component.values = { y: 2 } as any;
        component.resizeMarks();
      });
      it('does not call setRanges once', () => {
        expect(component.setRanges).toHaveBeenCalledTimes(0);
      });

      it('does not call setScaledSpaceProperties once', () => {
        expect(component.setScaledSpaceProperties).toHaveBeenCalledTimes(0);
      });

      it('does not call drawMarks', () => {
        expect(component.drawMarks).toHaveBeenCalledTimes(0);
      });
    });

    describe('if values.y is falsy', () => {
      beforeEach(() => {
        component.values = { x: 1 } as any;
        component.resizeMarks();
      });
      it('does not call setRanges once', () => {
        expect(component.setRanges).toHaveBeenCalledTimes(0);
      });

      it('does not call setScaledSpaceProperties once', () => {
        expect(component.setScaledSpaceProperties).toHaveBeenCalledTimes(0);
      });

      it('does not call drawMarks', () => {
        expect(component.drawMarks).toHaveBeenCalledTimes(0);
      });
    });
  });

  describe('setMethodsFromConfigAndDraw()', () => {
    beforeEach(() => {
      spyOn(component, 'setValueArrays');
      spyOn(component, 'initNonQuantitativeDomains');
      spyOn(component, 'setValueIndicies');
      spyOn(component, 'setHasBarsWithNegativeValues');
      spyOn(component, 'initQuantitativeDomain');
      spyOn(component, 'initCategoryScale');
      spyOn(component, 'initRanges');
      spyOn(component, 'setScaledSpaceProperties');
      spyOn(component, 'drawMarks');
      component.config = { transitionDuration: 200 } as any;
      component.setMethodsFromConfigAndDraw();
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

    it('calls setHasBarsWithNegativeValues', () => {
      expect(component.setHasBarsWithNegativeValues).toHaveBeenCalledTimes(1);
    });

    it('calls initQuantitativeDomain once', () => {
      expect(component.initQuantitativeDomain).toHaveBeenCalledTimes(1);
    });

    it('calls initRanges once', () => {
      expect(component.initRanges).toHaveBeenCalledTimes(1);
    });

    it('calls setScaledSpaceProperties once', () => {
      expect(component.setScaledSpaceProperties).toHaveBeenCalledTimes(1);
    });

    it('calls drawMarks once with the correct argument', () => {
      expect(component.drawMarks).toHaveBeenCalledOnceWith(200);
    });
  });

  describe('setValueArrays()', () => {
    beforeEach(() => {
      component.config = {
        data: [
          { color: 'red', value: 1, size: 10 },
          { color: 'orange', value: 2, size: 20 },
          { color: 'yellow', value: 3, size: 30 },
          { color: 'green', value: 4, size: 40 },
          { color: 'blue', value: 5, size: 50 },
        ],
        ordinal: {
          valueAccessor: (x) => x.size,
        },
        quantitative: {
          valueAccessor: (x) => x.value,
        },
        category: {
          valueAccessor: (x) => x.color,
        },
        dimensions: {
          x: 'ordinal',
          y: 'quantitative',
        },
      } as any;
    });
    describe('if x dimension is ordinal', () => {
      it('correctly sets x values', () => {
        component.setValueArrays();
        expect(component.values.x).toEqual([10, 20, 30, 40, 50]);
      });

      it('correctly sets y values', () => {
        component.setValueArrays();
        expect(component.values.y).toEqual([1, 2, 3, 4, 5]);
      });
    });

    describe('if x dimension is quantitative', () => {
      beforeEach(() => {
        component.config.dimensions = {
          x: 'quantitative',
          y: 'ordinal',
        } as any;
      });
      it('correctly sets x values', () => {
        component.setValueArrays();
        expect(component.values.x).toEqual([1, 2, 3, 4, 5]);
      });

      it('correctly sets y values', () => {
        component.setValueArrays();
        expect(component.values.y).toEqual([10, 20, 30, 40, 50]);
      });
    });

    it('correctly sets category values', () => {
      component.setValueArrays();
      expect(component.values.category).toEqual([
        'red',
        'orange',
        'yellow',
        'green',
        'blue',
      ]);
    });
  });

  describe('initNonQuantitativeDomains', () => {
    beforeEach(() => {
      component.values = {
        x: [1, 2, 3, 4, 5],
        y: [10, 20, 30, 40, 50],
        category: ['red', 'orange', 'yellow', 'green', 'blue'],
      } as any;
      component.config = {
        dimensions: {
          ordinal: 'x',
        },
        ordinal: {},
        category: {},
      } as any;
    });
    describe('ordinal is x dimension', () => {
      it('correctly defines ordinal.domain if ordinal.domain is undefined', () => {
        component.config.ordinal.domain = undefined;
        component.initNonQuantitativeDomains();
        expect(Array.from(component.config.ordinal.domain)).toEqual([
          1, 2, 3, 4, 5,
        ]);
      });

      it('correctly defines ordinal.domain if ordinal.domain is defined', () => {
        component.config.ordinal.domain = [0, 1, 2, 3, 3, 11, 11, 12];
        component.initNonQuantitativeDomains();
        expect(Array.from(component.config.ordinal.domain)).toEqual([
          0, 1, 2, 3, 11, 12,
        ]);
      });
    });

    describe('ordinal is y dimension', () => {
      beforeEach(() => {
        component.config.dimensions = {
          ordinal: 'y',
        } as any;
      });
      it('correctly defines ordinal.domain if ordinal.domain is undefined', () => {
        component.config.ordinal.domain = undefined;
        component.initNonQuantitativeDomains();
        expect(Array.from(component.config.ordinal.domain)).toEqual([
          10, 20, 30, 40, 50,
        ]);
      });

      it('correctly defines ordinal.domain if ordinal.domain is defined', () => {
        component.config.ordinal.domain = [0, 10, 20, 30, 30, 110, 110, 120];
        component.initNonQuantitativeDomains();
        expect(Array.from(component.config.ordinal.domain)).toEqual([
          0, 10, 20, 30, 110, 120,
        ]);
      });
    });

    it('correctly defines category.domain if category.domain is undefined', () => {
      component.config.category.domain = undefined;
      component.initNonQuantitativeDomains();
      expect(Array.from(component.config.category.domain)).toEqual([
        'red',
        'orange',
        'yellow',
        'green',
        'blue',
      ]);
    });

    it('correctly defines category.domain if category.domain is defined', () => {
      component.config.category.domain = [
        'red',
        'red',
        'orange',
        'yellow',
        'yellow',
        'green',
        'blue',
      ];
      component.initNonQuantitativeDomains();
      expect(Array.from(component.config.category.domain)).toEqual([
        'red',
        'orange',
        'yellow',
        'green',
        'blue',
      ]);
    });
  });

  describe('setValueIndicies', () => {
    beforeEach(() => {
      component.values = {
        x: [1, 2, 3, 4, 5],
        y: [10, 20, 30, 40, 50],
        category: ['red', 'orange', 'yellow', 'green', 'blue'],
      } as any;
      component.config = {
        dimensions: {
          ordinal: 'x',
        },
        ordinal: {
          domain: new InternSet([1, 2, 3, 4, 5]),
        },
      } as any;
    });
    describe('ordinal is x dimension', () => {
      it('correctly sets ordinal.valueIndicies if all values are in ordinal domain', () => {
        component.setValueIndicies();
        expect(component.values.indicies).toEqual([0, 1, 2, 3, 4]);
      });

      it('correctly sets ordinal.valueIndicies if not all values are in ordinal domain', () => {
        component.values.x = [6, 1, 2, 3, 4, 5];
        component.setValueIndicies();
        expect(component.values.indicies).toEqual([1, 2, 3, 4, 5]);
      });
    });

    describe('ordinal is y dimension', () => {
      beforeEach(() => {
        component.config.ordinal.domain = new InternSet([10, 20, 30, 40, 50]);
        component.config.dimensions.ordinal = 'y';
      });
      it('correctly sets ordinal.valueIndicies if all values are in ordinal domain', () => {
        component.setValueIndicies();
        expect(component.values.indicies).toEqual([0, 1, 2, 3, 4]);
      });

      it('correctly sets ordinal.valueIndicies if not all values are in ordinal domain', () => {
        component.values.y = [60, 10, 20, 30, 40, 50];
        component.setValueIndicies();
        expect(component.values.indicies).toEqual([1, 2, 3, 4, 5]);
      });
    });
  });

  describe('setHasBarsWithNegativeValues', () => {
    beforeEach(() => {
      component.values = {
        x: [1, 2, 3, 4, -5],
      } as any;
      component.config = new BarsConfig();
      component.config.dimensions.quantitative = 'x';
    });
    it('integration: sets hasBarsWithNegativeValues to true if dataMin is less than zero', () => {
      component.setHasBarsWithNegativeValues();
      expect(component.hasBarsWithNegativeValues).toBe(true);
    });

    it('integration: sets hasBarsWithNegativeValues to false if dataMin is greater than zero', () => {
      component.values.x = [1, 2, 3, 4, 5];
      component.setHasBarsWithNegativeValues();
      expect(component.hasBarsWithNegativeValues).toBe(false);
    });
  });

  describe('initRanges()', () => {
    beforeEach(() => {
      component.config = {
        ordinal: { range: [0, 1] },
        quantitative: { range: [0, 1] },
      } as any;
      spyOn(component, 'setOrdinalRange');
      spyOn(component, 'setQuantitativeRange');
    });
    it('calls setOrdinalRange once if config.ordinal.range is undefined', () => {
      component.config.ordinal.range = undefined;
      component.initRanges();
      expect(component.setOrdinalRange).toHaveBeenCalledTimes(1);
    });

    it('does not call setOrdinalRange if config.ordinal.range is defined', () => {
      component.initRanges();
      expect(component.setOrdinalRange).not.toHaveBeenCalled();
    });

    it('calls setQuantitativeRange once if config.quantitative.range is undefined', () => {
      component.config.quantitative.range = undefined;
      component.initRanges();
      expect(component.setQuantitativeRange).toHaveBeenCalledTimes(1);
    });

    it('does not call setQuantitativeRange if config.quantitative.range is defined', () => {
      component.initRanges();
      expect(component.setQuantitativeRange).not.toHaveBeenCalled();
    });
  });

  describe('setRanges()', () => {
    beforeEach(() => {
      spyOn(component, 'setOrdinalRange');
      spyOn(component, 'setQuantitativeRange');
    });
    it('calls setOrdinalRange once', () => {
      component.setRanges();
      expect(component.setOrdinalRange).toHaveBeenCalledTimes(1);
    });

    it('calls setQuantitativeRange once', () => {
      component.setRanges();
      expect(component.setQuantitativeRange).toHaveBeenCalledTimes(1);
    });
  });

  describe('setOrdinalRange()', () => {
    beforeEach(() => {
      spyOn(component.chart, 'getXRange').and.returnValue([0, 1]);
      spyOn(component.chart, 'getYRange').and.returnValue([2, 3]);
      component.config = {
        dimensions: { ordinal: 'x' },
        ordinal: { range: ['test'] },
      } as any;
    });
    describe('if ordinal is x', () => {
      it('calls getXRange on chart once', () => {
        component.setOrdinalRange();
        expect(component.chart.getXRange).toHaveBeenCalledTimes(1);
      });

      it('sets config.ordinal.range to the correct value', () => {
        component.setOrdinalRange();
        expect(component.config.ordinal.range).toEqual([0, 1]);
      });

      it('does not call getYRange on chart', () => {
        component.setOrdinalRange();
        expect(component.chart.getYRange).not.toHaveBeenCalled();
      });
    });

    describe('if ordinal is not x', () => {
      beforeEach(() => {
        component.config.dimensions.ordinal = 'y';
      });
      it('calls getYRange on chart once', () => {
        component.setOrdinalRange();
        expect(component.chart.getYRange).toHaveBeenCalledTimes(1);
      });

      it('sets config.ordinal.range to the correct value', () => {
        component.setOrdinalRange();
        expect(component.config.ordinal.range).toEqual([2, 3]);
      });

      it('does not call getXRange on chart', () => {
        component.setOrdinalRange();
        expect(component.chart.getXRange).not.toHaveBeenCalled();
      });
    });
  });

  describe('setQuantitativeRange()', () => {
    beforeEach(() => {
      spyOn(component.chart, 'getXRange').and.returnValue([0, 1]);
      spyOn(component.chart, 'getYRange').and.returnValue([2, 3]);
      component.config = {
        dimensions: { ordinal: 'x' },
        quantitative: { range: undefined },
      } as any;
    });
    describe('if ordinal is x', () => {
      it('calls getYRange on chart once', () => {
        component.setQuantitativeRange();
        expect(component.chart.getYRange).toHaveBeenCalledTimes(1);
      });

      it('sets config.quantitative.range to the correct value', () => {
        component.setQuantitativeRange();
        expect(component.config.quantitative.range).toEqual([2, 3]);
      });

      it('does not call getXRange on chart', () => {
        component.setQuantitativeRange();
        expect(component.chart.getXRange).not.toHaveBeenCalled();
      });
    });

    describe('if ordinal is not x', () => {
      beforeEach(() => {
        component.config.dimensions.ordinal = 'y';
      });
      it('calls getXRange on chart once', () => {
        component.setQuantitativeRange();
        expect(component.chart.getXRange).toHaveBeenCalledTimes(1);
      });

      it('sets config.quantitative.range to the correct value', () => {
        component.setQuantitativeRange();
        expect(component.config.quantitative.range).toEqual([0, 1]);
      });

      it('does not call getYRange on chart', () => {
        component.setQuantitativeRange();
        expect(component.chart.getYRange).not.toHaveBeenCalled();
      });
    });
  });

  describe('setScaledSpaceProperties', () => {
    beforeEach(() => {
      component.config = {
        dimensions: { ordinal: 'x' },
      } as any;
      component.xySpace = {
        updateXScale: jasmine.createSpy('updateXScale'),
        updateYScale: jasmine.createSpy('updateYScale'),
      } as any;
      spyOn(component, 'getOrdinalScale').and.returnValue('ord scale');
      spyOn(component, 'getQuantitativeScale').and.returnValue('quant scale');
    });
    it('calls getOrdinalScale once', () => {
      component.setScaledSpaceProperties();
      expect(component.getOrdinalScale).toHaveBeenCalledTimes(1);
    });

    it('calls getQuantitativeScale once', () => {
      component.setScaledSpaceProperties();
      expect(component.getQuantitativeScale).toHaveBeenCalledTimes(1);
    });

    describe('if ordinal is x', () => {
      it('calls updateXScale once with the correct value', () => {
        component.setScaledSpaceProperties();
        expect(component.xySpace.updateXScale).toHaveBeenCalledOnceWith(
          'ord scale' as any
        );
      });

      it('calls updateYScale once with the correct value', () => {
        component.setScaledSpaceProperties();
        expect(component.xySpace.updateYScale).toHaveBeenCalledOnceWith(
          'quant scale' as any
        );
      });
    });

    describe('if ordinal is not x', () => {
      beforeEach(() => {
        component.config.dimensions.ordinal = 'y';
      });
      it('calls updateXScale once with the correct value', () => {
        component.setScaledSpaceProperties();
        expect(component.xySpace.updateXScale).toHaveBeenCalledOnceWith(
          'quant scale' as any
        );
      });

      it('calls updateYScale once with the correct value', () => {
        component.setScaledSpaceProperties();
        expect(component.xySpace.updateYScale).toHaveBeenCalledOnceWith(
          'ord scale' as any
        );
      });
    });
  });

  describe('drawMarks()', () => {
    beforeEach(() => {
      spyOn(component, 'drawBars');
      spyOn(component, 'drawBarLabels');
      component.config = new BarsConfig();
      component.config.labels.show = true;
    });

    it('calls drawBars once with the correct parameter', () => {
      component.drawMarks(100);
      expect(component.drawBars).toHaveBeenCalledOnceWith(100);
    });

    it('calls drawBarLabels if config.labels.show is truthy', () => {
      component.drawMarks(100);
      expect(component.drawBarLabels).toHaveBeenCalledTimes(1);
    });

    it('does not call drawBarLabels if config.labels.show is falsey', () => {
      component.config.labels.show = false;
      component.drawMarks(100);
      expect(component.drawBarLabels).not.toHaveBeenCalled();
    });
  });

  describe('getBarLabelText', () => {
    beforeEach(() => {
      component.config = new BarsConfig();
      component.config = {
        dimensions: { quantitative: 'x' },
        quantitative: {
          valueFormat: ',.0f',
        },
        labels: {
          noValueString: 'no value',
        },
      } as any;
      component.values.x = [10000.1, 20000.2, 30000.3];
    });
    describe('value is a number', () => {
      it('integration: returns the correct value correctly formatted as a string', () => {
        expect(component.getBarLabelText(1)).toEqual('20,000');
      });
    });
    describe('integration: value is falsey', () => {
      it('returns the config.labels.noValueString', () => {
        component.values.x = [null, null, null];
        expect(component.getBarLabelText(1)).toEqual('no value');
      });
    });
  });

  describe('getBarLabelColor', () => {
    beforeEach(() => {
      spyOn(component, 'getBarColor').and.returnValue('bar color');
      component.config = new BarsConfig();
    });
    describe('config.labels.color is defined', () => {
      beforeEach(() => {
        component.config = { labels: { color: 'label color' } } as any;
      });
      it('returns the correct value', () => {
        component.config.labels.color = 'label color';
        expect(component.getBarLabelColor(1)).toEqual('label color');
      });

      it('does not call getBarColor', () => {
        component.getBarLabelColor(1);
        expect(component.getBarColor).not.toHaveBeenCalled();
      });
    });

    describe('config.labels.color is not defined', () => {
      it('calls getBarColor once', () => {
        component.getBarLabelColor(1);
        expect(component.getBarColor).toHaveBeenCalledOnceWith(1);
      });

      it('returns the correct value', () => {
        expect(component.getBarLabelColor(1)).toEqual('bar color');
      });
    });
  });

  describe('getBarColor()', () => {
    beforeEach(() => {
      const colorScaleSpy = jasmine
        .createSpy('colorScale')
        .and.returnValue('blue');
      component.config = {
        dimensions: { ordinal: 'x' },
        category: {
          colorScale: colorScaleSpy,
        },
      } as any;
      component.values.x = [1, 2, 3];
    });
    it('calls colorScale once with the correct value', () => {
      component.getBarColor(0);
      expect(component.config.category.colorScale).toHaveBeenCalledOnceWith(1);
    });
    it('returns the correct value', () => {
      const result = component.getBarColor(0);
      expect(result).toEqual('blue');
    });
  });

  describe('getBarX()', () => {
    beforeEach(() => {
      spyOn(component, 'getBarXOrdinal').and.returnValue('ordinal' as any);
      spyOn(component, 'getBarXQuantitative').and.returnValue(
        'quantitative' as any
      );
      component.config = { dimensions: { ordinal: 'x' } } as any;
    });
    describe('x dimension is ordinal', () => {
      it('calls getBarXOrdinal once with the correct value', () => {
        component.getBarX(100);
        expect(component.getBarXOrdinal).toHaveBeenCalledOnceWith(100);
      });

      it('does not call getBarXQuantitative', () => {
        component.getBarX(100);
        expect(component.getBarXQuantitative).not.toHaveBeenCalled();
      });

      it('returns the correct value', () => {
        expect(component.getBarX(100)).toEqual('ordinal' as any);
      });
    });

    describe('y dimension is ordinal', () => {
      beforeEach(() => {
        component.config.dimensions.ordinal = 'y';
      });

      it('calls getBarXQuantitative once with the correct value', () => {
        component.getBarX(100);
        expect(component.getBarXQuantitative).toHaveBeenCalledOnceWith(100);
      });

      it('does not call getBarXOrdinal', () => {
        component.getBarX(100);
        expect(component.getBarXOrdinal).not.toHaveBeenCalled();
      });

      it('returns the correct value', () => {
        expect(component.getBarX(100)).toEqual('quantitative' as any);
      });
    });
  });

  describe('getBarXOrdinal()', () => {
    beforeEach(() => {
      component.xScale = jasmine.createSpy('xScale').and.returnValue(10);
      component.values.x = [1, 2, 3];
    });
    it('calls xScale once and with the correct value', () => {
      component.getBarXOrdinal(2);
      expect(component.xScale).toHaveBeenCalledOnceWith(3);
    });
    it('returns the correct value', () => {
      expect(component.getBarXOrdinal(2)).toEqual(10);
    });
  });

  describe('getBarXQuantitative()', () => {
    beforeEach(() => {
      component.xScale = jasmine.createSpy('xScale').and.returnValue(50);
      component.hasBarsWithNegativeValues = true;
      component.values.x = [1, 2, 3];
      component.config = {
        quantitative: {
          domain: [2, 10],
        },
      } as any;
    });
    describe('hasBarsWithNegativeValues is true', () => {
      it('calls xScale once and with the correct value if x value is less than zero', () => {
        component.values.x = [-1, 2, 3];
        component.getBarXQuantitative(0);
        expect(component.xScale).toHaveBeenCalledOnceWith(-1);
      });

      it('calls xScale once with 0 if x value is greater than zero', () => {
        component.getBarXQuantitative(2);
        expect(component.xScale).toHaveBeenCalledOnceWith(0);
      });
    });

    describe('hasBarsWithNegativeValues is false', () => {
      it('calls xScale once and with the correct value', () => {
        component.hasBarsWithNegativeValues = false;
        component.getBarXQuantitative(0);
        expect(component.xScale).toHaveBeenCalledOnceWith(2);
      });
    });

    it('returns the correct value', () => {
      expect(component.getBarXQuantitative(0)).toEqual(50);
    });
  });

  describe('getBarY()', () => {
    beforeEach(() => {
      component.yScale = jasmine.createSpy('yScale').and.returnValue(50);
      component.values.y = [1, 2, 3];
    });
    it('calls yScale once and with the correct value', () => {
      component.getBarY(2);
      expect(component.yScale).toHaveBeenCalledOnceWith(3);
    });

    it('returns the correct value', () => {
      expect(component.getBarY(2)).toEqual(50);
    });
  });

  describe('getBarWidth()', () => {
    beforeEach(() => {
      spyOn(component, 'getBarWidthOrdinal').and.returnValue('ordinal' as any);
      spyOn(component, 'getBarWidthQuantitative').and.returnValue(
        'quantitative' as any
      );
      component.config = { dimensions: { ordinal: 'x' } } as any;
    });
    describe('x dimension is ordinal', () => {
      it('calls getBarWidthOrdinal once with the correct value', () => {
        component.getBarWidth(100);
        expect(component.getBarWidthOrdinal).toHaveBeenCalledOnceWith(100);
      });

      it('does not call getBarWidthQuantitative', () => {
        component.getBarWidth(100);
        expect(component.getBarWidthQuantitative).not.toHaveBeenCalled();
      });

      it('returns the correct value', () => {
        expect(component.getBarWidth(100)).toEqual('ordinal' as any);
      });
    });

    describe('y dimension is ordinal', () => {
      beforeEach(() => {
        component.config.dimensions.ordinal = 'y';
      });

      it('calls getBarWidthQuantitative once with the correct value', () => {
        component.getBarWidth(100);
        expect(component.getBarWidthQuantitative).toHaveBeenCalledOnceWith(100);
      });

      it('does not call getBarWidthOrdinal', () => {
        component.getBarWidth(100);
        expect(component.getBarWidthOrdinal).not.toHaveBeenCalled();
      });

      it('returns the correct value', () => {
        expect(component.getBarWidth(100)).toEqual('quantitative' as any);
      });
    });
  });

  describe('getBarLabelX', () => {
    let quantSpy: jasmine.Spy;
    beforeEach(() => {
      spyOn(component, 'getBarWidthOrdinal').and.returnValue(10);
      quantSpy = spyOn(component, 'getBarWidthQuantitative').and.returnValue(
        50
      );
      component.config = {
        labels: {
          offset: 4,
        },
        dimensions: {
          ordinal: 'x',
        },
      } as any;
    });
    describe('x dimension is  ordinal', () => {
      it('calls getBarWidthOrdinal once with the correct value', () => {
        component.getBarLabelX(100);
        expect(component.getBarWidthOrdinal).toHaveBeenCalledOnceWith(100);
      });

      it('returns the correct value', () => {
        expect(component.getBarLabelX(100)).toEqual(5);
      });
    });

    describe('x dimension is not ordinal', () => {
      beforeEach(() => {
        component.config.dimensions.ordinal = 'y';
      });
      it('calls getBarWidthQuantitative once and with the correct value', () => {
        component.getBarLabelX(2);
        expect(component.getBarWidthQuantitative).toHaveBeenCalledOnceWith(2);
      });
      it('returns the correct value if barWidthQuantitative is a number', () => {
        expect(component.getBarLabelX(2)).toEqual(54);
      });

      it('returns the correct value if barWidthQuantitative is not a number', () => {
        quantSpy.and.returnValue(null as any);
        expect(component.getBarLabelX(2)).toEqual(4);
      });
    });
  });

  describe('getBarWidthOrdinal()', () => {
    beforeEach(() => {
      component.xScale = {
        bandwidth: jasmine.createSpy('bandwidth').and.returnValue(10),
      } as any;
    });
    it('calls xScale.bandwidth once', () => {
      component.getBarWidthOrdinal(2);
      expect((component.xScale as any).bandwidth).toHaveBeenCalledTimes(1);
    });

    it('returns the correct value', () => {
      expect(component.getBarWidthOrdinal(2)).toEqual(10);
    });
  });

  describe('getBarWidthQuantitative()', () => {
    let xScaleSpy: jasmine.Spy;
    beforeEach(() => {
      xScaleSpy = jasmine.createSpy('xScale').and.returnValues(20, 50);
      component.xScale = xScaleSpy;
      component.hasBarsWithNegativeValues = true;
      component.values.x = [1, 2, 3];
      component.config = {
        quantitative: {
          domain: [2, 10],
        },
      } as any;
    });
    describe('hasBarsWithNegativeValues is true', () => {
      it('calls xScale twice and with the correct values', () => {
        component.getBarWidthQuantitative(2);
        expect(xScaleSpy.calls.allArgs()).toEqual([[3], [0]]);
      });
    });

    describe('hasBarsWithNegativeValues is false', () => {
      it('calls xScale twice and with the correct values', () => {
        component.hasBarsWithNegativeValues = false;
        component.getBarWidthQuantitative(2);
        expect(xScaleSpy.calls.allArgs()).toEqual([[3], [2]]);
      });
    });

    it('returns the correct value', () => {
      expect(component.getBarWidthQuantitative(2)).toEqual(30);
    });
  });

  describe('getBarHeight()', () => {
    beforeEach(() => {
      spyOn(component, 'getBarHeightOrdinal').and.returnValue('ordinal' as any);
      spyOn(component, 'getBarHeightQuantitative').and.returnValue(
        'quantitative' as any
      );
      component.config = { dimensions: { ordinal: 'x' } } as any;
    });
    describe('x dimension is ordinal', () => {
      it('calls getBarHeightQuantitative once with the correct value', () => {
        component.getBarHeight(100);
        expect(component.getBarHeightQuantitative).toHaveBeenCalledOnceWith(
          100
        );
      });

      it('does not call getBarHeightOrdinal', () => {
        component.getBarHeight(100);
        expect(component.getBarHeightOrdinal).not.toHaveBeenCalled();
      });

      it('returns the correct value', () => {
        expect(component.getBarHeight(100)).toEqual('quantitative' as any);
      });
    });

    describe('y dimension is ordinal', () => {
      beforeEach(() => {
        component.config.dimensions.ordinal = 'y';
      });

      it('calls getBarHeightOrdinal once with the correct value', () => {
        component.getBarHeight(100);
        expect(component.getBarHeightOrdinal).toHaveBeenCalledOnceWith(100);
      });

      it('does not call getBarHeightQuantitative', () => {
        component.getBarHeight(100);
        expect(component.getBarHeightQuantitative).not.toHaveBeenCalled();
      });

      it('returns the correct value', () => {
        expect(component.getBarHeight(100)).toEqual('ordinal' as any);
      });
    });
  });

  describe('getBarLabelY', () => {
    let quantSpy: jasmine.Spy;
    beforeEach(() => {
      spyOn(component, 'getBarHeightOrdinal').and.returnValue(10);
      quantSpy = spyOn(component, 'getBarHeightQuantitative').and.returnValue(
        50
      );
      component.config = {
        labels: {
          offset: 4,
        },
        dimensions: {
          ordinal: 'x',
        },
      } as any;
    });
    describe('x dimension is ordinal', () => {
      it('calls getBarHeightQuantitative once and with the correct value', () => {
        component.getBarLabelY(2);
        expect(component.getBarHeightQuantitative).toHaveBeenCalledOnceWith(2);
      });

      it('returns the correct value if barHeightQuantitative is a number', () => {
        expect(component.getBarLabelY(2)).toEqual(54);
      });

      it('returns the correct value if barHeightQuantitative is not a number', () => {
        quantSpy.and.returnValue(null as any);
        expect(component.getBarLabelY(2)).toEqual(4);
      });
    });

    describe('x dimension is not ordinal', () => {
      beforeEach(() => {
        component.config.dimensions.ordinal = 'y';
      });
      it('calls getBarHeightOrdinal once with the correct value', () => {
        component.getBarLabelY(100);
        expect(component.getBarHeightOrdinal).toHaveBeenCalledOnceWith(100);
      });

      it('returns the correct value', () => {
        expect(component.getBarLabelY(100)).toEqual(5);
      });
    });
  });

  describe('getBarHeightOrdinal()', () => {
    beforeEach(() => {
      component.yScale = {
        bandwidth: jasmine.createSpy('bandwidth').and.returnValue(10),
      } as any;
    });
    it('calls yScale.bandwidth once', () => {
      component.getBarHeightOrdinal(2);
      expect((component.yScale as any).bandwidth).toHaveBeenCalledTimes(1);
    });

    it('returns the correct value', () => {
      expect(component.getBarHeightOrdinal(2)).toEqual(10);
    });
  });

  describe('getBarHeightQuantitative()', () => {
    let yScaleSpy: jasmine.Spy;
    beforeEach(() => {
      yScaleSpy = jasmine.createSpy('yScale').and.returnValue(-50);
      component.yScale = yScaleSpy;
      component.hasBarsWithNegativeValues = true;
      component.values.y = [1, 2, 3];
      component.config = {
        quantitative: {
          domain: [2, 10],
        },
      } as any;
    });
    describe('hasBarsWithNegativeValues is true', () => {
      it('calls yScale once and with the correct values', () => {
        component.getBarHeightQuantitative(2);
        expect(component.yScale).toHaveBeenCalledOnceWith(-3);
      });
    });

    describe('hasBarsWithNegativeValues is false', () => {
      it('calls yScale once and with the correct value', () => {
        component.hasBarsWithNegativeValues = false;
        component.getBarHeightQuantitative(2);
        expect(component.yScale).toHaveBeenCalledOnceWith(-1);
      });
    });

    it('returns the correct value', () => {
      expect(component.getBarHeightQuantitative(2)).toEqual(50);
    });
  });
});
