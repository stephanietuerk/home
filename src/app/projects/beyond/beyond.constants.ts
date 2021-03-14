import { scaleLinear } from 'd3';
import { CensusVariable, ElectionType, ElectionYear } from './models/beyond-enums.model';

export const BEYOND_ELECTIONYEARS = [
    { value: ElectionYear._2012, name: '2012' },
    { value: ElectionYear._2016, name: '2016' },
    { value: ElectionYear.change, name: 'Change' },
];

export const BEYOND_ELECTIONTYPES = [
    { value: ElectionType.president, name: 'President' },
    { value: ElectionType.senate, name: 'US Senate' },
    { value: ElectionType.house, name: 'US House' },
];

export const BEYOND_DEMOYEARS = [{ value: 'change', name: 'Change 2010-2015' }];

export const BEYOND_DEMOTYPES = [
    { value: CensusVariable.populationDensity, name: 'Population Density' },
    { value: CensusVariable.nonWhite, name: 'Percent Non-White' },
    { value: CensusVariable.unemployment, name: 'Percent Unemployed' },
    { value: CensusVariable.college, name: 'Education' },
    { value: CensusVariable.income, name: 'Income' },
];

export const BEYOND_COLORS = {
    rColor: '#f4003d',
    dColor: '#2437ff',
    dMapColor: '#394bff',
    oColor: '#f6b500',
    initialColor: '#cccccc',
    dkGrey: '#bbbbbb',
};

export const BEYOND_SCALES = {
    vote: {
        r: scaleLinear().domain([0, 1]).range(['#f8e5e6', '#dd0035']),
        d: scaleLinear().domain([-1, 0]).range(['#3c5bff', '#d2e4ff']),
    },
    change: {
        r: scaleLinear().domain([0, 0.5]).range(['#f8e5e6', '#dd0035']),
        d: scaleLinear().domain([-0.5, 0]).range(['#3c5bff', '#e6f0ff']),
    },
};
