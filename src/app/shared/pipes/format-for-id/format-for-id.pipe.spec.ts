import { FormatForIdPipe } from './format-for-id.pipe';

describe('FormatForIdPipe', () => {
  let pipe: FormatForIdPipe;

  beforeEach(() => {
    pipe = new FormatForIdPipe();
  });

  it('should return the string with whitespaces replaced by -', () => {
    const result = pipe.transform('test me');
    expect(result).toEqual('test-me');
  });

  it('should return the string transformed to lowercase', () => {
    const result = pipe.transform('TestMe');
    expect(result).toEqual('testme');
  });
  it('return undefined with non-string values', () => {
    const value = 1;
    expect(pipe.transform(value as any)).toBeUndefined();
  });
});
