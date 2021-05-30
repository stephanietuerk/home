import { scaleLinear } from 'd3';
import { DemoTime, DemoVariable, ElectionType, ElectionYear } from './models/beyond-enums.model';

export const BEYOND_ELECTIONYEARS = [
    { value: ElectionYear._2012, name: '2012', title: '2012' },
    { value: ElectionYear._2016, name: '2016', title: '2016' },
    { value: ElectionYear.change, name: 'Change', title: 'Change in Margin, 2012 - 2016' },
];

export const BEYOND_ELECTIONTYPES = [
    { value: ElectionType.president, name: 'President', title: 'US Presidential Election Results by Census Tract' },
    { value: ElectionType.senate, name: 'US Senate', title: 'US Senate Election Results by Census Tract' },
    {
        value: ElectionType.house,
        name: 'US House',
        title: 'US House of Representatives Election Results by Census Tract',
    },
];

export const BEYOND_DEMOYEARS = [
    { value: DemoTime.current, name: '2015', title: '2015' },
    { value: DemoTime.change, name: 'Change 2010-2015', title: 'Change, 2010 - 2015' },
];

export const BEYOND_DEMOTYPES = [
    {
        value: DemoVariable.populationDensity,
        name: 'Population Density',
        title: 'Population Density of Each Census Tract',
        yAxis: 'population density',
        xAxis: 'population/sq mi',
    },
    {
        value: DemoVariable.nonWhite,
        name: 'Percent Non-White',
        title: 'Percent Non-White Population for Each Census Tract',
        yAxis: 'percent non-white',
        xAxis: '% of total population',
    },
    {
        value: DemoVariable.unemployment,
        name: 'Percent Unemployed',
        title: 'Percent of Population Unemployed for Each Census Tract',
        yAxis: 'percent unemployed',
        xAxis: '% of total population',
    },
    {
        value: DemoVariable.college,
        name: 'Education',
        title: 'Percent of Population with College Degree for Each Census Tract',
        yAxis: 'college degree',
        xAxis: '% of total population',
    },
    { value: DemoVariable.income, name: 'Income', title: 'Income', yAxis: 'median income', xAxis: 'household income' },
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
