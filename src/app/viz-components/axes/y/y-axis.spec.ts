import { axisLeft, axisRight } from 'd3';
import { BehaviorSubject, of, take } from 'rxjs';
import { Ranges } from '../../chart/chart.component';
import { XyChartComponentStub } from '../../testing/stubs/xy-chart.component.stub';
import { YAxisStub } from '../../testing/stubs/y-axis.stub';

describe('the XAxis mixin', () => {
  let abstractClass: YAxisStub;
  let chart: XyChartComponentStub;
  let testRanges: Ranges;

  beforeEach(() => {
    chart = new XyChartComponentStub();
    abstractClass = new YAxisStub(chart as any);
    testRanges = { x: [0, 10], y: [20, 50] } as Ranges;
  });

  describe('setTranslate()', () => {
    const rangesBS = new BehaviorSubject<Ranges>(null);
    beforeEach(() => {
      abstractClass.chart = {
        ranges$: rangesBS.asObservable(),
      } as any;
      spyOn(abstractClass, 'getTranslateDistance').and.returnValue(90);
      rangesBS.next(testRanges);
      abstractClass.setTranslate();
    });
    it('calls getTranslateDistance once', () => {
      abstractClass.translate$
        .subscribe((str) => {
          expect(abstractClass.getTranslateDistance).toHaveBeenCalledOnceWith(
            testRanges
          );
        })
        .unsubscribe();
    });

    it('returns the correct string', () => {
      abstractClass.translate$
        .subscribe((str) => {
          expect(str).toBe('translate(90, 0)');
        })
        .unsubscribe();
    });
  });

  describe('getTranslateDistance', () => {
    beforeEach(() => {
      spyOn(abstractClass, 'getLeftTranslate').and.returnValue(90);
      spyOn(abstractClass, 'getRightTranslate').and.returnValue(60);
    });
    it('returns the correct value for the left side', () => {
      abstractClass.side = 'left';
      expect(abstractClass.getTranslateDistance(testRanges)).toBe(90);
    });

    it('returns the correct value for the right side', () => {
      abstractClass.side = 'right';
      expect(abstractClass.getTranslateDistance(testRanges)).toBe(60);
    });
  });

  describe('getLeftTranslate', () => {
    it('returns the correct value', () => {
      expect(abstractClass.getLeftTranslate(testRanges)).toEqual(0);
    });
  });

  describe('getRightTranslate', () => {
    it('returns the correct value', () => {
      abstractClass.chart = {
        margin: { right: 40 },
      } as any;
      expect(abstractClass.getRightTranslate(testRanges)).toEqual(-30);
    });
  });

  describe('setScale', () => {
    let spy: jasmine.Spy;
    beforeEach(() => {
      spy = spyOn(abstractClass, 'subscribeToScale');
    });
    it('calls subscribeToScale with the correct scale', () => {
      const scales = {
        x: 'hello',
        useTransition: false,
        y: 'something else',
      } as any;
      abstractClass.chart.scales$ = of(scales);
      abstractClass.setScale();
      spy.calls
        .mostRecent()
        .args[0].pipe(take(1))
        .subscribe((scale) => {
          expect(scale).toEqual({
            y: 'something else',
            useTransition: false,
          });
        });
    });
  });

  describe('setAxisFunction', () => {
    it('sets the axis function to the correct value if side is top', () => {
      abstractClass.side = 'left';
      abstractClass.setAxisFunction();
      expect(abstractClass.axisFunction).toEqual(axisLeft);
    });

    it('sets the axis function to the correct value if side is bottom', () => {
      abstractClass.side = 'right';
      abstractClass.setAxisFunction();
      expect(abstractClass.axisFunction).toEqual(axisRight);
    });
  });

  describe('initNumTicks', () => {
    it('sets the numTicks to the correct value', () => {
      abstractClass.chart = { height: 100 } as any;
      expect(abstractClass.initNumTicks()).toEqual(2);
    });
  });
});
