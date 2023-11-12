import { SentenceCasePipe } from './sentence-case.pipe';

describe('SentenceCasePipe', () => {
  let pipe: SentenceCasePipe<string | number>;

  beforeEach(() => {
    pipe = new SentenceCasePipe();
  });

  describe('if the input parameter is a string', () => {
    it('returns a string whose first character is upper case if value', () => {
      const result = pipe.transform('hello I am A SENtence');
      expect(result).toBe('Hello i am a sentence');
    });
  });

  describe('if the input parameter is not a string', () => {
    it('returns the input parameter', () => {
      const result = pipe.transform(123);
      expect(result).toEqual(123);
    });
  });
});
