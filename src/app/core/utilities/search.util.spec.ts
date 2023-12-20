import { SearchUtilities } from './search.util';

describe('getCleanedSearchTerms', () => {
  it('cleans the search terms', () => {
    expect(
      SearchUtilities.getCleanedSearchTerms(
        'this is a SEARCH term with trailing whitespace '
      )
    ).toEqual([
      'this',
      'is',
      'SEARCH',
      'term',
      'with',
      'trailing',
      'whitespace',
    ]);
  });

  it('returns no search terms if the input is null', () => {
    expect(SearchUtilities.getCleanedSearchTerms(null)).toEqual([]);
  });
});

describe('hasPartialMatchesInText', () => {
  it('returns true if every search term is included in the text', () => {
    expect(
      SearchUtilities.hasPartialMatchesInText('this is text', ['this', 'is'])
    ).toBeTrue();
  });
  it('returns false if every search term is not included in the text', () => {
    expect(
      SearchUtilities.hasPartialMatchesInText('this is text', [
        'this',
        'is',
        'stuff',
      ])
    ).toBeFalse();
  });
});
