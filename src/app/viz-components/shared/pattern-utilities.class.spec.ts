import { PatternPredicate } from '../data-marks/data-marks.config';
import { PatternUtilities } from './pattern-utilities.class';

describe('PatternUtilities', () => {
  describe('integration: getPatternFill', () => {
    const predicates: PatternPredicate[] = [
      { patternName: 'pattern', predicate: (d: number) => d > 2 },
    ];
    it('returns pattern when predicate is true', () => {
      const output = PatternUtilities.getPatternFill(3, 'blue', predicates);
      expect(output).toBe('url(#pattern)');
    });

    it('returns default color when predicate is false', () => {
      const output = PatternUtilities.getPatternFill(2, 'blue', predicates);
      expect(output).toBe('blue');
    });

    it('returns default color when no predicates exist', () => {
      const output = PatternUtilities.getPatternFill(3, 'blue', undefined);
      expect(output).toBe('blue');
    });
  });
});
