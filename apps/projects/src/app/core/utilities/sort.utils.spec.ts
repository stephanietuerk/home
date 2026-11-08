import { SortUtils } from './sort.utils';

describe('RobustSortSortUtils', () => {
  describe('integration: valueCompare()', () => {
    it('should properly sort an array of numbers in ascending order', () => {
      const test = [8, 13, 4, 2, 1];
      const result = test.sort((a, b) => SortUtils.valueCompare(true, a, b));
      expect(result).toEqual([1, 2, 4, 8, 13]);
    });
    it('should properly sort an array of numbers in descending order', () => {
      const test = [8, 13, 4, 2, 1];
      const result = test.sort((a, b) => SortUtils.valueCompare(false, a, b));
      expect(result).toEqual([13, 8, 4, 2, 1]);
    });
    it('should properly sort an array of strings in ascending order', () => {
      const test = ['PA', 'AZ', 'MO', 'HI', 'MD'];
      const result = test.sort((a, b) => SortUtils.valueCompare(true, a, b));
      expect(result).toEqual(['AZ', 'HI', 'MD', 'MO', 'PA']);
    });
    it('should properly sort an array of strings in descending order ', () => {
      const test = ['PA', 'AZ', 'MO', 'HI', 'MD'];
      const result = test.sort((a, b) => SortUtils.valueCompare(false, a, b));
      expect(result).toEqual(['PA', 'MO', 'MD', 'HI', 'AZ']);
    });
    it('should properly sort an array of strings and numbers and nulls in ascending order ', () => {
      const test = ['PA', 2, null, 24, 'HI'];
      const result = test.sort((a, b) => SortUtils.valueCompare(true, a, b));
      expect(result).toEqual([null, 2, 24, 'HI', 'PA']);
    });
    it('should properly sort an array of strings and numbers in descending order ', () => {
      const test = ['PA', 2, null, 24, 'HI'];
      const result = test.sort((a, b) => SortUtils.valueCompare(false, a, b));
      expect(result).toEqual(['PA', 'HI', 24, 2, null]);
    });
  });
});
