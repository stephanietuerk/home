import { formatNumber } from '@angular/common';
import { cloneDeep } from 'lodash';
import { SelectionOption } from 'src/app/shared/components/form-components/form-radio-input/form-radio-input.model';
import { InputOption } from 'src/app/shared/components/input-option.model';
import { TableHeader } from 'src/app/shared/components/table/table.model';
import { Field, FormatSpecifications } from './models/art-history-config';

export const enDash = '\u2013';

export const artHistoryJobsColors = {
    brightBlue: '#0088FF', // bright blue
    powderPink: '#eda4ba', //powder pink
    brightMint: '#38f0ac', //bright mint
    darkGreen: '#40655e', //dark green
    brightRed: '#eb1138', //bright red
    maroon: '#832522', // maroon
    gold: 'gold',
    slateBlueGray: '#63a3b7', //slate blue gray
    dustyPurple: '#91799c', //dusty purple
    grassGreen: '#88dc40', // grass green
    darkVioletBlue: '#60409b', // dark violet blue
    paleChartreuse: '#d6da7d', //pale chartreuse
    brightPurple: '#9620fc', //bright purple
    pineGreen: '#178535', //pine green
    brightMagenta: '#ed2bb1', // bright pink -magenta
    lightOrange: '#ef972d', //light orange
    brightSkyBlue: '#20d8fd', //bright sky blue
    redOrange: '#ff5f23', //red orange
    poopBrown: '#8d630a', //poop brown
};

export const artHistoryFields: Field[] = [
    { name: { full: 'All', short: 'All' }, color: artHistoryJobsColors.brightBlue, selected: true, sort: 0 },
    {
        name: {
            full: 'African / African Diaspora Art',
            short: 'Af. / Af. Dias. Art',
        },
        color: artHistoryJobsColors.powderPink,
        selected: false,
        sort: 1,
    },
    {
        name: { full: 'Ancient Art', short: 'Ancient Art' },
        color: artHistoryJobsColors.darkGreen,
        selected: false,
        sort: 2,
    },
    {
        name: { full: 'Architecture', short: 'Architecture' },
        color: artHistoryJobsColors.brightRed,
        selected: false,
        sort: 3,
    },
    {
        name: {
            full: 'Arts Management / Arts Administration',
            short: 'Arts Mgmt / Admin',
        },
        color: artHistoryJobsColors.maroon,
        selected: false,
        sort: 4,
    },
    {
        name: {
            full: 'Asian / Asian Diaspora Art',
            short: 'Asian / Asian Dias. Art',
        },
        color: artHistoryJobsColors.gold,
        selected: false,
        sort: 5,
    },
    {
        name: {
            full: 'Byzantine / Medieval Art',
            short: 'Byz. / Medieval Art',
        },
        color: artHistoryJobsColors.slateBlueGray,
        selected: false,
        sort: 6,
    },
    {
        name: {
            full: 'Design',
            short: 'Design',
        },
        color: artHistoryJobsColors.dustyPurple,
        selected: false,
        sort: 7,
    },
    {
        name: {
            full: 'Early Modern / Renaissance / Eighteenth & Nineteenth Century Art',
            short: `Early Mod. ${enDash} 19th C. Art`,
        },
        color: artHistoryJobsColors.grassGreen,
        selected: false,
        sort: 8,
    },
    {
        name: {
            full: 'Film / Photography',
            short: 'Film / Photo',
        },
        color: artHistoryJobsColors.paleChartreuse,
        selected: false,
        sort: 9,
    },
    {
        name: { full: 'Gender Studies', short: 'Gender Studies' },
        color: artHistoryJobsColors.brightPurple,
        selected: false,
        sort: 10,
    },
    {
        name: { full: 'General / Open', short: 'General / Open' },
        color: artHistoryJobsColors.pineGreen,
        selected: false,
        sort: 11,
    },
    {
        name: {
            full: 'Global / Non-Western Art',
            short: 'Global / Non-Western Art',
        },
        color: artHistoryJobsColors.brightMagenta,
        selected: false,
        sort: 12,
    },
    {
        name: {
            full: 'Latin American Art',
            short: 'Lat. American Art',
        },
        color: artHistoryJobsColors.lightOrange,
        selected: false,
        sort: 13,
    },
    {
        name: {
            full: 'Middle Eastern / Islamic Art',
            short: 'Middle Eastern / Islamic Art',
        },
        color: artHistoryJobsColors.brightSkyBlue,
        selected: false,
        sort: 14,
    },
    {
        name: {
            full: 'Modern / Contemporary Art',
            short: 'Mod. / Contemp. Art',
        },
        color: artHistoryJobsColors.redOrange,
        selected: false,
        sort: 15,
    },
    {
        name: {
            full: 'North American Art',
            short: 'N. American Art',
        },
        color: artHistoryJobsColors.brightMint,
        selected: false,
        sort: 16,
    },
    {
        name: {
            full: 'Visual Studies / Visual Culture',
            short: 'Visual Studies',
        },
        color: artHistoryJobsColors.poopBrown,
        selected: false,
        sort: 17,
    },
];

export enum ValueType {
    count = 'count',
    percent = 'percent',
}

export enum FilterType {
    filter = 'filter',
    disaggregate = 'disaggregate',
}

const filterOptionSelected: InputOption = {
    label: 'Filter',
    selected: true,
    value: FilterType.filter,
};

const filterOptionUnselected: InputOption = {
    label: 'Filter',
    selected: false,
    value: FilterType.filter,
};

const disaggregateOptionSelected: InputOption = {
    label: 'Disaggregate',
    selected: true,
    value: FilterType.disaggregate,
};

const disaggregateOptionUnselected: InputOption = {
    label: 'Disaggregate',
    selected: false,
    value: FilterType.disaggregate,
};

const percentOption: InputOption = {
    label: 'Percent of all jobs',
    selected: false,
    value: ValueType.percent,
};

const numberOption: InputOption = {
    label: 'Number of jobs',
    selected: true,
    value: ValueType.count,
};

export const tenureFilterOptions: InputOption[] = [
    cloneDeep(filterOptionUnselected),
    cloneDeep(disaggregateOptionSelected),
];

export const rankFilterOptions: InputOption[] = [
    cloneDeep(filterOptionSelected),
    cloneDeep(disaggregateOptionUnselected),
];

export const dataTypeOptions: SelectionOption[] = [
    { label: 'Count', value: ValueType.count },
    { label: 'Percent', value: ValueType.percent },
];

export enum TenureType {
    all = 'all',
    true = 'true',
    false = 'false',
    unknown = 'unknown',
}

export const tenureOptions: InputOption[] = [
    {
        label: 'All',
        selected: false,
        value: TenureType.all,
    },
    {
        label: 'Tenure track',
        selected: true,
        value: TenureType.true,
    },
    {
        label: 'Non-tenure track',
        selected: true,
        value: TenureType.false,
    },
    {
        label: 'Unknown',
        selected: false,
        value: TenureType.unknown,
    },
];

export enum RankType {
    all = 'all',
    assistant_prof = 'assistant_prof',
    associate_prof = 'associate_prof',
    full_prof = 'full_prof',
    open_rank = 'open_rank',
    lecturer = 'lecturer',
    vap = 'vap',
    unknown = 'unknown',
}

export const rankOptions: InputOption[] = [
    {
        label: 'All',
        selected: true,
        value: RankType.all,
    },
    {
        label: 'Assistant professor',
        selected: false,
        value: RankType.assistant_prof,
    },
    {
        label: 'Associate professor',
        selected: false,
        value: RankType.associate_prof,
    },
    {
        label: 'Full professor',
        selected: false,
        value: RankType.full_prof,
    },
    {
        label: 'Open rank',
        selected: false,
        value: RankType.open_rank,
    },
    {
        label: 'Lecturer',
        selected: false,
        value: RankType.lecturer,
    },
    {
        label: 'Visiting position',
        selected: false,
        value: RankType.vap,
    },
    {
        label: 'Unknown',
        selected: false,
        value: RankType.unknown,
    },
];

export const tableHeaders: TableHeader[] = [
    {
        display: 'Field',
        align: 'left',
        id: 'field',
        type: 'string',
        sort: {
            canSort: true,
            direction: null,
        },
    },
    {
        display: 'Avg',
        align: 'right',
        id: 'avg',
        type: 'number',
        formatter: (x) => formatNumber(x, 'en-US', '1.1-1'),
        sort: {
            canSort: true,
            direction: null,
        },
    },
    {
        display: '2021',
        align: 'right',
        id: 'current',
        type: 'number',
        formatter: (x) => formatNumber(x, 'en-US', '1.1-1'),
        sort: {
            canSort: true,
            direction: 'desc',
        },
    },
];

export const formatSpecifications: FormatSpecifications = {
    explore: {
        chart: {
            value: {
                percent: '.1%',
                integer: ',.0f',
                decimal: ',.1f',
                year: '%Y',
            },
            tick: {
                year: '%Y',
                percent: '.0%',
                integer: ',.0f',
                decimal: ',.0f',
            },
        },
    },
};
