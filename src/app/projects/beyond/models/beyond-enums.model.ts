export type ElectionTypeOption = keyof typeof ElectionType;
export type ElectionYearOption = keyof typeof ElectionYear;
export type CensusVariableOption = keyof typeof CensusVariable;

export const enum ElectionType {
    president = 'president',
    senate = 'senate',
    house = 'house',
}

export const enum ElectionYear {
    _2016 = '2016',
    _2012 = '2012',
    change = 'change',
}

export const enum CensusTime {
    current = 'current',
    change = 'change',
}

export const enum CensusVariable {
    populationDensity = 'populationDensity',
    nonWhite = 'nonWhite',
    unemployment = 'unemployment',
    college = 'college',
    income = 'income',
}
