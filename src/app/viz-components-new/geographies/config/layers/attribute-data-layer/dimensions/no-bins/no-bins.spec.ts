/* eslint-disable @typescript-eslint/no-explicit-any */
import { NoBinsAttributeDataDimension } from './no-bins';
import { NoBinsAttributeDataDimensionBuilder } from './no-bins-builder';

describe('VicNoBinsAttributeDataDimension', () => {
  let dimension: NoBinsAttributeDataDimension<any>;
  beforeEach(() => {
    dimension = new NoBinsAttributeDataDimensionBuilder<any>()
      .valueAccessor((d) => d)
      ._build();
  });

  describe('setPropertiesFromData', () => {
    beforeEach(() => {
      spyOn(dimension as any, 'setDomain');
    });
    it('calls setDomain once', () => {
      dimension.setPropertiesFromData([1, 2, 3, 4, 5, 6, 7, 8, 9]);
      expect((dimension as any).setDomain).toHaveBeenCalledOnceWith([
        1, 2, 3, 4, 5, 6, 7, 8, 9,
      ]);
    });
  });

  describe('setDomain', () => {
    it('sets the domain to the users value if it exists', () => {
      dimension = new NoBinsAttributeDataDimensionBuilder<any>()
        .valueAccessor((d) => d)
        .domain([0, 5])
        ._build();
      (dimension as any).setDomain([1, 2, 3, 4, 5, 6, 7, 8, 9]);
      expect((dimension as any).domain).toEqual([0, 5]);
    });
    it('sets the domain to values if there is no user provided domain', () => {
      dimension = new NoBinsAttributeDataDimensionBuilder<any>()
        .valueAccessor((d) => d)
        ._build();
      (dimension as any).setDomain([1, 2, 3, 4, 5, 6, 7, 8, 9]);
      expect((dimension as any).domain).toEqual([1, 9]);
    });
  });
});
