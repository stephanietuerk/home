export class SortUtils {
  static valueCompare(sortAscending: boolean, a: unknown, b: unknown): number {
    // sort comparator that works with nulls and values of different types
    let valueA = a;
    let valueB = b;
    const valueAType = typeof valueA;
    const valueBType = typeof valueB;

    if (valueAType !== valueBType) {
      if (valueAType === 'number') {
        valueA += '';
      }
      if (valueBType === 'number') {
        valueB += '';
      }
    }

    let comparatorResult = 0;
    if (valueA != null && valueB != null) {
      if (valueA > valueB) {
        comparatorResult = 1;
      } else if (valueA < valueB) {
        comparatorResult = -1;
      }
    } else if (valueA != null) {
      comparatorResult = 1;
    } else if (valueB != null) {
      comparatorResult = -1;
    }

    return comparatorResult * (sortAscending ? 1 : -1);
  }
}
