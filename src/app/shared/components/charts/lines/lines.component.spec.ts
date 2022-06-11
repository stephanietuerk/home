import { CUSTOM_ELEMENTS_SCHEMA, SimpleChange } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BehaviorSubject } from 'rxjs';
import { UtilitiesService } from 'src/app/core/services/utilities.service';
import { MainServiceStub } from 'src/app/testing/stubs/main.service.stub';
import { ChartComponent } from '../chart/chart.component';
import { HtmlTooltipConfig } from '../html-tooltip/html-tooltip.model';
import { XYChartSpaceComponent } from '../xy-chart-space/xy-chart-space.component';
import { LinesComponent } from './lines.component';
import { LinesConfig } from './lines.model';

describe('LineChartComponent', () => {
  let component: LinesComponent;
  let fixture: ComponentFixture<LinesComponent>;
  let mainServiceStub: MainServiceStub;

  beforeEach(async () => {
    mainServiceStub = new MainServiceStub();
    await TestBed.configureTestingModule({
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      declarations: [LinesComponent],
      providers: [
        ChartComponent,
        XYChartSpaceComponent,
        {
          provide: UtilitiesService,
          useValue: mainServiceStub.utilitiesServiceStub,
        },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LinesComponent);
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
      spyOn(component, 'setLine');
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

      it('calls setLine once', () => {
        expect(component.setLine).toHaveBeenCalledTimes(1);
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

      it('does not call setLine once', () => {
        expect(component.setLine).toHaveBeenCalledTimes(0);
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

      it('does not call setLine once', () => {
        expect(component.setLine).toHaveBeenCalledTimes(0);
      });

      it('does not call drawMarks', () => {
        expect(component.drawMarks).toHaveBeenCalledTimes(0);
      });
    });
  });

  describe('setMethodsFromConfigAndDraw()', () => {
    beforeEach(() => {
      spyOn(component, 'setValueArrays');
      spyOn(component, 'initDomains');
      spyOn(component, 'setValueIndicies');
      spyOn(component, 'initRanges');
      spyOn(component, 'setScaledSpaceProperties');
      spyOn(component, 'initCategoryScale');
      spyOn(component, 'setLine');
      spyOn(component, 'drawMarks');
      component.config = { transitionDuration: 200 } as any;
      component.setMethodsFromConfigAndDraw();
    });

    it('calls setValueArrays once', () => {
      expect(component.setValueArrays).toHaveBeenCalledTimes(1);
    });

    it('calls initDomains once', () => {
      expect(component.initDomains).toHaveBeenCalledTimes(1);
    });

    it('calls setValueIndicies once', () => {
      expect(component.setValueIndicies).toHaveBeenCalledTimes(1);
    });

    it('calls initRanges once', () => {
      expect(component.initRanges).toHaveBeenCalledTimes(1);
    });

    it('calls setScaledSpaceProperties once', () => {
      expect(component.setScaledSpaceProperties).toHaveBeenCalledTimes(1);
    });

    it('calls initCategoryScale once', () => {
      expect(component.initCategoryScale).toHaveBeenCalledTimes(1);
    });

    it('calls setLine once', () => {
      expect(component.setLine).toHaveBeenCalledTimes(1);
    });

    it('calls drawMarks once with the correct argument', () => {
      expect(component.drawMarks).toHaveBeenCalledOnceWith(200);
    });
  });

  describe('initRanges()', () => {
    beforeEach(() => {
      spyOn(component.chart, 'getXRange').and.returnValue('x range' as any);
      spyOn(component.chart, 'getYRange').and.returnValue('y range' as any);
      component.config = {
        x: { range: [0, 100] } as any,
        y: { range: [0, 100] } as any,
      } as any;
    });

    describe('if config.x.range is undefined', () => {
      beforeEach(() => {
        component.config.x.range = undefined;
      });
      it('calls getXRange once if config.x.range is undefined', () => {
        component.initRanges();
        expect(component.chart.getXRange).toHaveBeenCalledTimes(1);
      });

      it('sets config.x.range to the correct value', () => {
        component.initRanges();
        expect(component.config.x.range).toEqual('x range' as any);
      });
    });

    it('does not call getXRange if config.x.range is defined', () => {
      component.initRanges();
      expect(component.chart.getXRange).not.toHaveBeenCalled();
    });

    describe('if config.y.range is undefined', () => {
      beforeEach(() => {
        component.config.y.range = undefined;
      });
      it('calls getYRange once if config.y.range is undefined', () => {
        component.initRanges();
        expect(component.chart.getYRange).toHaveBeenCalledTimes(1);
      });

      it('sets config.y.range to the correct value', () => {
        component.initRanges();
        expect(component.config.y.range).toEqual('y range' as any);
      });
    });

    it('does not call getYRange if config.y.range is defined', () => {
      component.initRanges();
      expect(component.chart.getYRange).not.toHaveBeenCalled();
    });
  });

  describe('setRanges()', () => {
    beforeEach(() => {
      component.config = {
        x: { range: undefined } as any,
        y: { range: undefined } as any,
      } as any;
      spyOn(component.chart, 'getXRange').and.returnValue('x range' as any);
      spyOn(component.chart, 'getYRange').and.returnValue('y range' as any);
    });

    it('calls getXRange once', () => {
      component.setRanges();
      expect(component.chart.getXRange).toHaveBeenCalledTimes(1);
    });

    it('sets config.x.range to the correct value', () => {
      component.setRanges();
      expect(component.config.x.range).toEqual('x range' as any);
    });

    it('calls getYRange once', () => {
      component.setRanges();
      expect(component.chart.getYRange).toHaveBeenCalledTimes(1);
    });

    it('sets config.y.range to the correct value', () => {
      component.setRanges();
      expect(component.config.y.range).toEqual('y range' as any);
    });
  });

  describe('canBeDrawnByPath()', () => {
    it('integration: returns true if value is a number', () => {
      expect(component.canBeDrawnByPath(1)).toBe(true);
    });

    it('integration: returns true if value is a Date', () => {
      expect(component.canBeDrawnByPath(new Date())).toBe(true);
    });

    it('integration: returns false if value is undefined', () => {
      expect(component.canBeDrawnByPath(undefined)).toBe(false);
    });

    it('integration: returns false if value is a string', () => {
      expect(component.canBeDrawnByPath('string')).toBe(false);
    });

    it('integration: returns false if value is null', () => {
      expect(component.canBeDrawnByPath(null)).toBe(false);
    });

    it('integration: returns false if value is an object', () => {
      expect(component.canBeDrawnByPath({ oops: 'not a num' })).toBe(false);
    });

    it('integration: returns false if value is an array', () => {
      expect(component.canBeDrawnByPath(['not a num'])).toBe(false);
    });

    it('integration: returns false if value is boolean', () => {
      expect(component.canBeDrawnByPath(true)).toBe(false);
    });
  });

  describe('drawMarks()', () => {
    const duration = 50;
    beforeEach(() => {
      spyOn(component, 'drawLines');
      spyOn(component, 'drawPointMarkers');
      spyOn(component, 'drawLineLabels');
      component.config = new LinesConfig();
    });
    it('calls drawLines once and with the correct argument', () => {
      component.drawMarks(duration);
      expect(component.drawLines).toHaveBeenCalledOnceWith(duration);
    });

    it('calls drawPointMarkers once with the correct argument if config.pointMarker.radius is truthy', () => {
      component.config.pointMarker = { radius: 2 };
      component.drawMarks(duration);
      expect(component.drawPointMarkers).toHaveBeenCalledOnceWith(duration);
    });

    it('does not call drawPointMarkers once if config.pointMarker.radius is falsy', () => {
      component.drawMarks(duration);
      expect(component.drawPointMarkers).toHaveBeenCalledTimes(0);
    });

    it('calls drawLineLabels once if config.labelLines is true', () => {
      component.config.labelLines = true;
      component.drawMarks(duration);
      expect(component.drawLineLabels).toHaveBeenCalledTimes(1);
    });

    it('does not call drawLineLabels once if config.labelLines is false', () => {
      component.drawMarks(duration);
      expect(component.drawLineLabels).toHaveBeenCalledTimes(0);
    });
  });

  describe('onPointerEnter()', () => {
    let setTooltipPositionSpy: jasmine.Spy;
    beforeEach(() => {
      setTooltipPositionSpy = jasmine.createSpy('setTooltipPosition');
      component.chart = {
        setTooltipPosition: setTooltipPositionSpy,
      } as any;
      component.config = { showTooltip: true } as any;
    });
    it('calls setTooltipPosition on chart if config.showTooltip is true', () => {
      component.onPointerEnter();
      expect(component.chart.setTooltipPosition).toHaveBeenCalledTimes(1);
    });

    it('does not call setTooltipPosition on chart if config.showTooltip is false', () => {
      component.config.showTooltip = false;
      component.onPointerEnter();
      expect(component.chart.setTooltipPosition).toHaveBeenCalledTimes(0);
    });
  });

  describe('onPointerLeave()', () => {
    beforeEach(() => {
      spyOn(component, 'resetChartStylesAfterHover');
      component.config = { showTooltip: true } as any;
    });
    it('calls resetChartStylesAfterHover if config.showTooltip is true', () => {
      component.onPointerLeave();
      expect(component.resetChartStylesAfterHover).toHaveBeenCalledTimes(1);
    });

    it('does not call resetChartStylesAfterHover if config.showTooltip is false', () => {
      component.config.showTooltip = false;
      component.onPointerLeave();
      expect(component.resetChartStylesAfterHover).toHaveBeenCalledTimes(0);
    });
  });

  describe('onPointerMove()', () => {
    let chartAreaSpy: jasmine.Spy;
    beforeEach(() => {
      spyOn(component, 'getPointerValuesArray').and.returnValue([1, 2]);
      chartAreaSpy = spyOn(component, 'pointerIsInChartArea').and.returnValue(
        true
      );
      spyOn(component, 'determineHoverStyles');
      component.config = { showTooltip: true } as any;
    });
    it('calls getPointerValuesArray once with the correct argument', () => {
      component.onPointerMove('event' as any);
      expect(component.getPointerValuesArray).toHaveBeenCalledOnceWith(
        'event' as any
      );
    });

    describe('if config.showTooltip is true', () => {
      it('calls pointerIsInChartArea once with the correct argument', () => {
        component.onPointerMove('event' as any);
        expect(component.pointerIsInChartArea).toHaveBeenCalledOnceWith(1, 2);
      });

      it('calls determineHoverStyles once with the correct arguments if pointerIsInChartArea returns true', () => {
        component.onPointerMove('event' as any);
        expect(component.determineHoverStyles).toHaveBeenCalledOnceWith(1, 2);
      });

      it('does not call determineHoverStyles once if pointerIsInChartArea returns false', () => {
        chartAreaSpy.and.returnValue(false);
        component.onPointerMove('event' as any);
        expect(component.determineHoverStyles).toHaveBeenCalledTimes(0);
      });
    });

    describe('if config.showTooltip is false', () => {
      it('does not call determineHoverStyles', () => {
        component.config.showTooltip = false;
        component.onPointerMove('event' as any);
        expect(component.determineHoverStyles).toHaveBeenCalledTimes(0);
      });
    });
  });

  describe('pointerIsInChartArea()', () => {
    beforeEach(() => {
      component.config = {
        x: { range: [0, 100] } as any,
        y: { range: [400, 200] } as any,
      } as any;
    });
    it('returns true if x is within x range and y is within y range', () => {
      expect(component.pointerIsInChartArea(50, 300)).toEqual(true);
    });

    it('returns false if x is not within x range', () => {
      expect(component.pointerIsInChartArea(150, 300)).toEqual(false);
    });

    it('returns false if y is not within y range', () => {
      expect(component.pointerIsInChartArea(50, 500)).toEqual(false);
    });
  });

  describe('determineHoverStyles()', () => {
    let radiusSpy: jasmine.Spy;
    beforeEach(() => {
      spyOn(component, 'getClosestPointIndex').and.returnValue(10);
      radiusSpy = spyOn(component, 'pointerIsInsideShowTooltipRadius');
      spyOn(component, 'applyHoverStyles');
      spyOn(component, 'removeHoverStyles');
      component.config = { tooltipDetectionRadius: 10 } as any;
    });
    it('calls getClosestPointIndex once with the correct argument', () => {
      component.determineHoverStyles(1, 2);
      expect(component.getClosestPointIndex).toHaveBeenCalledOnceWith(1, 2);
    });

    describe('if tooltipDetectionRadius is truthy', () => {
      it('calls pointerIsInsideShowTooltipRadius once and with the correct values', () => {
        component.determineHoverStyles(1, 2);
        expect(radiusSpy).toHaveBeenCalledOnceWith(10, 1, 2);
      });

      it('calls applyHoverStyles once with the correct value if pointerIsInsideShowTooltipRadius returns true', () => {
        radiusSpy.and.returnValue(true);
        component.determineHoverStyles(1, 2);
        expect(component.applyHoverStyles).toHaveBeenCalledOnceWith(10);
      });

      it('does not call applyHoverStyles if pointerIsInsideShowTooltipRadius returns false', () => {
        radiusSpy.and.returnValue(false);
        component.determineHoverStyles(1, 2);
        expect(component.applyHoverStyles).toHaveBeenCalledTimes(0);
      });

      it('calls removeHoverStyles once if pointerIsInsideShowTooltipRadius returns true', () => {
        radiusSpy.and.returnValue(false);
        component.determineHoverStyles(1, 2);
        expect(component.removeHoverStyles).toHaveBeenCalledTimes(1);
      });
    });

    describe('if tooltipDetectionRadius is falsy', () => {
      beforeEach(() => {
        component.config.tooltipDetectionRadius = null;
      });
      it('calls removeHoverStyles', () => {
        component.determineHoverStyles(1, 2);
        expect(component.removeHoverStyles).toHaveBeenCalledTimes(1);
      });

      it('does not call applyHoverStyles', () => {
        component.determineHoverStyles(1, 2);
        expect(component.applyHoverStyles).toHaveBeenCalledTimes(0);
      });
    });
  });

  describe('applyHoverStyles', () => {
    beforeEach(() => {
      spyOn(component, 'styleLinesForHover');
      spyOn(component, 'styleMarkersForHover');
      spyOn(component, 'styleHoverDotForHover');
      spyOn(component, 'setTooltipData');
      spyOn(component, 'setTooltipOffsetValues');
      component.chart = { htmlTooltip: new HtmlTooltipConfig() } as any;
      component.chart.htmlTooltip.display = 'none';
      component.tooltipCurrentlyShown = false;
      component.config = { pointMarker: 8 } as any;
    });
    it('calls styleLinesForHover once with the correct argument', () => {
      component.applyHoverStyles(10);
      expect(component.styleLinesForHover).toHaveBeenCalledOnceWith(10);
    });

    it('calls styleMarkersForHover once with the correct argument if config.pointMarker is truthy', () => {
      component.applyHoverStyles(10);
      expect(component.styleMarkersForHover).toHaveBeenCalledOnceWith(10);
    });

    it('does not call styleMarkersForHover if config.pointMarker is falsy', () => {
      component.config.pointMarker = null;
      component.applyHoverStyles(10);
      expect(component.styleMarkersForHover).toHaveBeenCalledTimes(0);
    });

    it('calls styleHoverDotForHover once with the correct argument if config.pointMarker is falsy', () => {
      component.config.pointMarker = null;
      component.applyHoverStyles(10);
      expect(component.styleHoverDotForHover).toHaveBeenCalledOnceWith(10);
    });

    it('does not call styleHoverDotForHover is config.pointMarker is truthy', () => {
      component.applyHoverStyles(10);
      expect(component.styleHoverDotForHover).toHaveBeenCalledTimes(0);
    });

    it('calls setTooltipData once with the correct argument', () => {
      component.applyHoverStyles(10);
      expect(component.setTooltipData).toHaveBeenCalledOnceWith(10);
    });

    it('calls setTooltipOffsetValues once with the correct argument', () => {
      component.applyHoverStyles(10);
      expect(component.setTooltipOffsetValues).toHaveBeenCalledOnceWith(10);
    });

    it('sets chart.htmlTooltip.display to block', () => {
      component.applyHoverStyles(10);
      expect(component.chart.htmlTooltip.display).toBe('block');
    });

    it('sets tooltipCurrentlyShown to true', () => {
      component.applyHoverStyles(10);
      expect(component.tooltipCurrentlyShown).toBe(true);
    });
  });

  describe('removeHoverStyles()', () => {
    beforeEach(() => {
      component.tooltipCurrentlyShown = true;
      spyOn(component, 'resetChartStylesAfterHover');
    });
    it('calls resetChartStylesAfterHover once if tooltipIsCurrentlyShown is true', () => {
      component.removeHoverStyles();
      expect(component.resetChartStylesAfterHover).toHaveBeenCalledTimes(1);
    });

    it('sets tooltipIsCurrentlyShown to false if tooltipIsCurrentlyShown is true', () => {
      component.removeHoverStyles();
      expect(component.tooltipCurrentlyShown).toEqual(false);
    });

    it('does not call resetChartStylesAfterHover if tooltipIsCurrentlyShown is false', () => {
      component.tooltipCurrentlyShown = false;
      component.removeHoverStyles();
      expect(component.resetChartStylesAfterHover).toHaveBeenCalledTimes(0);
    });

    it('does not modify tooltipIsCurrentlyShown if tooltipIsCurrentlyShown is false', () => {
      component.tooltipCurrentlyShown = false;
      component.removeHoverStyles();
      expect(component.tooltipCurrentlyShown).toEqual(false);
    });
  });

  describe('pointerIsInsideShowTooltipRadius', () => {
    let distanceSpy: jasmine.Spy;
    beforeEach(() => {
      distanceSpy = spyOn(component, 'getPointerDistanceFromPoint');
      component.values = {
        x: [0, 1, 2, 3],
        y: [4, 5, 6, 7],
      } as any;
      component.config = { tooltipDetectionRadius: 10 } as any;
    });
    it('calls getPointerDistanceFromPoint once and with the correct values', () => {
      component.pointerIsInsideShowTooltipRadius(1, 10, 20);
      expect(component.getPointerDistanceFromPoint).toHaveBeenCalledOnceWith(
        1,
        5,
        10,
        20
      );
    });

    it('returns true is the return value from getPointerDistanceFromPoint is less tan tooltipDetectionRadius', () => {
      distanceSpy.and.returnValue(9);
      expect(component.pointerIsInsideShowTooltipRadius(1, 10, 20)).toEqual(
        true
      );
    });

    it('returns false is the return value from getPointerDistanceFromPoint is greater than tooltipDetectionRadius', () => {
      distanceSpy.and.returnValue(11);
      expect(component.pointerIsInsideShowTooltipRadius(1, 10, 20)).toEqual(
        false
      );
    });
  });
});
