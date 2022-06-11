import { DashboardXYChartStub } from 'src/app/testing/stubs/dashboard-xy-chart.class.stub';
import { MainServiceStub } from 'src/app/testing/stubs/main.service.stub';

describe('the DashboardXYChart abstract class', () => {
  let abstractClass: DashboardXYChartStub;
  let mainServiceStub: MainServiceStub;

  beforeEach(() => {
    mainServiceStub = new MainServiceStub();
    abstractClass = new DashboardXYChartStub(
      mainServiceStub.utilitiesServiceStub as any
    );
  });

  describe('setChartProperties()', () => {
    beforeEach(() => {
      spyOn(abstractClass, 'getNewDataMarksConfig').and.returnValue(
        'dataMarks' as any
      );
      spyOn(abstractClass, 'getNewXAxisConfig').and.returnValue('xAxis' as any);
      spyOn(abstractClass, 'getNewYAxisConfig').and.returnValue('yAxis' as any);
    });
    it('calls getNewDataMarksConfig', () => {
      abstractClass.setChartProperties();
      expect(abstractClass.getNewDataMarksConfig).toHaveBeenCalledTimes(1);
    });

    it('sets the dataMarksConfig to the correct value', () => {
      abstractClass.setChartProperties();
      expect(abstractClass.dataMarksConfig).toEqual('dataMarks' as any);
    });

    it('calls getNewXAxisConfig', () => {
      abstractClass.setChartProperties();
      expect(abstractClass.getNewXAxisConfig).toHaveBeenCalledTimes(1);
    });

    it('sets the xAxisConfig to the correct value', () => {
      abstractClass.setChartProperties();
      expect(abstractClass.xAxisConfig).toEqual('xAxis' as any);
    });

    it('calls getNewYAxisConfig', () => {
      abstractClass.setChartProperties();
      expect(abstractClass.getNewYAxisConfig).toHaveBeenCalledTimes(1);
    });

    it('sets the yAxisConfig to the correct value', () => {
      abstractClass.setChartProperties();
      expect(abstractClass.yAxisConfig).toEqual('yAxis' as any);
    });
  });
});
