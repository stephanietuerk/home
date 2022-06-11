import { SimpleChange } from '@angular/core';
import { formatSpecifications } from 'src/app/core/constants/formats.constants';
import { ChartFormat } from 'src/app/core/constants/formats.model';
import { DashboardChartStub } from 'src/app/testing/stubs/dashboard-chart.class.stub';
import { MainServiceStub } from 'src/app/testing/stubs/main.service.stub';
import { Interval } from '../../dashboard-filter/dashboard-filter.enum';
import { ValueType } from '../dashboard-display.enum';

describe('the DashboardChart abstract class', () => {
  let abstractClass: DashboardChartStub;
  let mainServiceStub: MainServiceStub;

  beforeEach(() => {
    mainServiceStub = new MainServiceStub();
    abstractClass = new DashboardChartStub(
      mainServiceStub.utilitiesServiceStub as any
    );
  });

  describe('ngOnInit()', () => {
    beforeEach(() => {
      spyOn(abstractClass, 'setChartProperties');
      abstractClass.ngOnInit();
    });
    it('calls setChartProperties once', () => {
      expect(abstractClass.setChartProperties).toHaveBeenCalledTimes(1);
    });
  });

  describe('ngOnChanges()', () => {
    let chartChange: any;
    beforeEach(() => {
      spyOn(abstractClass, 'setChartProperties');
      chartChange = {
        chart: new SimpleChange('', '', false),
      };
    });

    it('should call objectChangedNotFirstTime once and with the correct parameters', () => {
      abstractClass.ngOnChanges(chartChange);
      expect(
        mainServiceStub.utilitiesServiceStub.objectChangedNotFirstTime
      ).toHaveBeenCalledOnceWith(chartChange, 'chart');
    });
    it('should call setChartProperties once if objectChangedNotFirstTime returns true', () => {
      mainServiceStub.utilitiesServiceStub.objectChangedNotFirstTime.and.returnValue(
        true
      );
      abstractClass.ngOnChanges(chartChange);
      expect(abstractClass.setChartProperties).toHaveBeenCalledTimes(1);
    });
    it('should call setChartProperties once if objectChangedNotFirstTime returns false', () => {
      mainServiceStub.utilitiesServiceStub.objectChangedNotFirstTime.and.returnValue(
        false
      );
      abstractClass.ngOnChanges(chartChange);
      expect(abstractClass.setChartProperties).toHaveBeenCalledTimes(0);
    });
  });

  describe('setChartProperties()', () => {
    beforeEach(() => {
      spyOn(abstractClass, 'getNewDataMarksConfig').and.returnValue(
        'dataMarks' as any
      );
    });
    it('calls getNewDataMarksConfig', () => {
      abstractClass.setChartProperties();
      expect(abstractClass.getNewDataMarksConfig).toHaveBeenCalledTimes(1);
    });

    it('sets the dataMarksConfig to the correct value', () => {
      abstractClass.setChartProperties();
      expect(abstractClass.dataMarksConfig).toEqual('dataMarks' as any);
    });
  });

  describe('getQuantitativeDomain', () => {
    it('returns [0, 1] if chart valueType is percent', () => {
      abstractClass.chart = { valueType: ValueType.percent } as any;
      const result = abstractClass.getQuantitativeDomain();
      expect(result).toEqual([0, 1]);
    });

    it('returns undefined if chart valueType is not percent', () => {
      abstractClass.chart = { valueType: ValueType.count } as any;
      const result = abstractClass.getQuantitativeDomain();
      expect(result).toBeUndefined();
    });
  });

  describe('getQuantitativeValueFormat', () => {
    beforeEach(() => {
      spyOn(abstractClass, 'getFormatFromChartFormatConstants').and.returnValue(
        'format'
      );
    });
    it('calls getFormatFromChartFormatConstants once with the correct value', () => {
      abstractClass.getQuantitativeValueFormat();
      expect(
        abstractClass.getFormatFromChartFormatConstants
      ).toHaveBeenCalledTimes(1);
      expect(
        abstractClass.getFormatFromChartFormatConstants
      ).toHaveBeenCalledWith(formatSpecifications.dashboard.chart.value);
    });

    it('returns the correct value', () => {
      const result = abstractClass.getQuantitativeValueFormat();
      expect(result).toEqual('format');
    });
  });

  describe('getQuantitativeTickFormat', () => {
    beforeEach(() => {
      spyOn(abstractClass, 'getFormatFromChartFormatConstants').and.returnValue(
        'format'
      );
    });
    it('calls getFormatFromChartFormatConstants once with the correct value', () => {
      abstractClass.getQuantitativeTickFormat();
      expect(
        abstractClass.getFormatFromChartFormatConstants
      ).toHaveBeenCalledTimes(1);
      expect(
        abstractClass.getFormatFromChartFormatConstants
      ).toHaveBeenCalledWith(formatSpecifications.dashboard.chart.tick);
    });

    it('returns the correct value', () => {
      const result = abstractClass.getQuantitativeTickFormat();
      expect(result).toEqual('format');
    });
  });

  describe('getFormatFromChartFormatConstants', () => {
    let formatObj: ChartFormat;
    beforeEach(() => {
      formatObj = {
        percent: 'percent format',
        integer: 'integer format',
        decimal: 'decimal format',
        [Interval.month]: 'month format',
        [Interval.quarter]: 'quarter format',
        [Interval.year]: 'year format',
      };
    });
    it('returns the correct type if chart valueType is percent', () => {
      abstractClass.chart = { valueType: ValueType.percent } as any;
      const result = abstractClass.getFormatFromChartFormatConstants(formatObj);
      expect(result).toEqual('percent format');
    });

    it('returns the correct type if chart valueType is percent change', () => {
      abstractClass.chart = { valueType: 'percent change' } as any;
      const result = abstractClass.getFormatFromChartFormatConstants(formatObj);
      expect(result).toEqual('percent format');
    });

    it('returns the correct type if chart valueType is count', () => {
      abstractClass.chart = { valueType: ValueType.count } as any;
      const result = abstractClass.getFormatFromChartFormatConstants(formatObj);
      expect(result).toEqual('integer format');
    });

    it('returns the correct type if chart valueType is days', () => {
      abstractClass.chart = { valueType: ValueType.days } as any;
      const result = abstractClass.getFormatFromChartFormatConstants(formatObj);
      expect(result).toEqual('decimal format');
    });

    it('returns the correct type if chart valueType is months', () => {
      abstractClass.chart = { valueType: ValueType.months } as any;
      const result = abstractClass.getFormatFromChartFormatConstants(formatObj);
      expect(result).toEqual('decimal format');
    });
  });
});
