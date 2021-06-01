export type ElectionTypeOption = keyof typeof ElectionType;
export type ElectionYearOption = keyof typeof ElectionYear;
export type CensusVariableOption = keyof typeof DemoVariable;

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

export const enum DemoTime {
    current = 'current',
    change = 'change',
}

export const enum DemoVariable {
    populationDensity = 'populationDensity',
    nonWhite = 'nonWhite',
    unemployment = 'unemployment',
    college = 'college',
    income = 'income',
}
