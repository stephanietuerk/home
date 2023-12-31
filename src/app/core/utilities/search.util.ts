export class SearchUtilities {
  static getCleanedSearchTerms(input: string): string[] {
    const wordsToFilter = ['', 'a', 'an', 'and', 'the'];
    if (input === null) {
      return [];
    } else {
      return input
        .trim()
        .split(' ')
        .filter((word) => !wordsToFilter.includes(word));
    }
  }

  static hasPartialMatchesInText(text: string, searchTerms: string[]): boolean {
    return searchTerms.every((term) =>
      text.toLowerCase().includes(term.toLowerCase())
    );
  }
}
