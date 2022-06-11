import { ArtHistoryFormatSpecifications } from './art-history-jobs.model';

export const artHistoryFormatSpecifications: ArtHistoryFormatSpecifications = {
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
    summary: {
        chart: {
            value: {
                year: '%Y',
                count: ',.1f',
            },
            tick: {
                year: '%Y',
                count: ',.0f',
            },
        },
        table: {
            avg: ',.1f',
            current: ',.1f',
        },
    },
};
