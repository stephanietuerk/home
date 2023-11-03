export interface PatternPredicate {
    patternName: string;
    predicate: (d: any) => boolean;
}

/**
 * @internal
 */
export class PatternUtilities {
    static getPatternFill(datum: any, defaultColor: string, predicates: PatternPredicate[]) {
        if (predicates) {
            predicates.forEach((predMapping: PatternPredicate) => {
                if (predMapping.predicate(datum)) {
                    defaultColor = `url(#${predMapping.patternName})`;
                }
            });
        }
        return defaultColor;
    }
}
