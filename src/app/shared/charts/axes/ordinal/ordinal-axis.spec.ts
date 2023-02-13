import { OrdinalAxisStub } from 'src/app/testing/stubs/components/ordinal-axis.stub';
import { XyChartComponentStub } from 'src/app/testing/stubs/components/xy-chart.component.stub';

describe('the OrdinalAxis mixin', () => {
  let abstractClass: OrdinalAxisStub;
  let chart: XyChartComponentStub;

  beforeEach(() => {
    chart = new XyChartComponentStub();
    abstractClass = new OrdinalAxisStub(chart as any);
  });

  describe('setAxis()', () => {
    let tickSizeOuterSpy: jasmine.Spy;
    let axisFunction: (...args: any[]) => any;
    beforeEach(() => {
      tickSizeOuterSpy = jasmine
        .createSpy('tickSizeOuter')
        .and.returnValue('tick size' as any);
      axisFunction = (scale: any) => {
        return {
          tickSizeOuter: tickSizeOuterSpy,
        };
      };
      abstractClass.scale = 'class scale' as any;
      abstractClass.defaultTickSizeOuter = 3;
      abstractClass.config = {
        tickSizeOuter: 6,
      } as any;
    });
    it('calls tickSizeOuter once with the correct value', () => {
      abstractClass.setAxis(axisFunction);
      expect(tickSizeOuterSpy).toHaveBeenCalledOnceWith(6);
    });
  });
});
