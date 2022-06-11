import { XYAxisElementStub } from 'src/app/testing/stubs/xy-axis.class.stub';

describe('the XYAxis abstract class', () => {
  let abstractClass: XYAxisElementStub;

  beforeEach(() => {
    abstractClass = new XYAxisElementStub();
  });

  describe('updateAxis()', () => {
    beforeEach(() => {
      spyOn(abstractClass, 'getAxisFunction').and.returnValue('func');
      spyOn(abstractClass, 'setAxis');
      spyOn(abstractClass, 'setTranslate');
      spyOn(abstractClass, 'drawAxis');
      spyOn(abstractClass, 'processAxisFeatures');
      abstractClass.updateAxis();
    });
    it('calls getAxisFunction once', () => {
      expect(abstractClass.getAxisFunction).toHaveBeenCalledTimes(1);
    });
    it('calls setAxis once with the correct value', () => {
      expect(abstractClass.setAxis).toHaveBeenCalledOnceWith('func');
    });

    it('calls setTranslate once', () => {
      expect(abstractClass.setTranslate).toHaveBeenCalledTimes(1);
    });

    it('calls drawAxis once', () => {
      expect(abstractClass.drawAxis).toHaveBeenCalledTimes(1);
    });

    it('calls processAxisFeatures once', () => {
      expect(abstractClass.processAxisFeatures).toHaveBeenCalledTimes(1);
    });
  });
});
