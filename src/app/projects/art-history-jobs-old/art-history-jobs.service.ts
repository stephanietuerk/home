import { Injectable } from '@angular/core';
import { csvParse } from 'd3';
import { BehaviorSubject, combineLatest } from 'rxjs';
import {
    artHistoryFields,
    dataTypeOptions,
    rankFilterOptions,
    tenureFilterOptions,
} from './art-history-jobs.constants';
import { ArtHistoryJobsResource } from './art-history-jobs.resource';
import { ArtHistorySelections, AttributeSelection, LineDef, YearsSelection } from './models/art-history-config';
import { JobDatum } from './models/art-history-data';

const initSelections: ArtHistorySelections = {
    fields: artHistoryFields.filter((x) => x.selected).map((x) => x.name.full),
    dataType: dataTypeOptions.find((x) => x.selected).value as 'percent' | 'count',
    tenure: {
        type: tenureFilterOptions.find((x) => x.selected).value as 'filter' | 'disaggregate',
        selection: ['true', 'false'],
    },
    rank: {
        type: rankFilterOptions.find((x) => x.selected).value as 'filter' | 'disaggregate',
        selection: ['all'],
    },
    years: {
        start: 2011,
        end: 2021,
    },
};

@Injectable({
    providedIn: 'root',
})
export class ArtHistoryJobsService {
    data: JobDatum[];
    filteredData: JobDatum[];
    fields$: BehaviorSubject<string[]> = new BehaviorSubject(initSelections.fields);
    fields = this.fields$.asObservable();
    dataType$: BehaviorSubject<string> = new BehaviorSubject(initSelections.dataType);
    dataType = this.dataType$.asObservable();
    tenureSelections$: BehaviorSubject<AttributeSelection> = new BehaviorSubject(initSelections.tenure);
    tenureSelections = this.tenureSelections$.asObservable();
    rankSelections$: BehaviorSubject<AttributeSelection> = new BehaviorSubject(initSelections.rank);
    rankSelections = this.rankSelections$.asObservable();
    yearsSelection$: BehaviorSubject<YearsSelection> = new BehaviorSubject(initSelections.years);
    yearsSelection = this.yearsSelection$.asObservable();
    selections: ArtHistorySelections;
    lineChartValues: string;
    lineChartCategoriesAccessor: string;
    lineChartData$: BehaviorSubject<JobDatum[]> = new BehaviorSubject(null);
    lineChartData = this.lineChartData$.asObservable();

    constructor(private resource: ArtHistoryJobsResource) {
        this.subscribeToSelections();
    }

    subscribeToSelections(): void {
        combineLatest([
            this.fields,
            this.dataType,
            this.tenureSelections,
            this.rankSelections,
            this.yearsSelection,
        ]).subscribe(
            ([fields, dataType, tenureSelections, rankSelections, yearsSelection]: [
                string[],
                'percent' | 'count',
                AttributeSelection,
                AttributeSelection,
                YearsSelection
            ]) => {
                this.selections = {
                    fields,
                    dataType,
                    tenure: tenureSelections,
                    rank: rankSelections,
                    years: yearsSelection,
                };
                if (this.data) {
                    this.setLineChartCategoriesAccessor();
                    this.setLineChartData();
                }
            }
        );
    }

    getData(): Promise<void> {
        return new Promise((resolve, reject) => {
            this.resource.getData().subscribe((data) => {
                this.data = this.parseData(data);
                this.setLineChartData();
                resolve();
            });
        });
    }

    parseData(data): JobDatum[] {
        return csvParse(data).map((x) => {
            return {
                year: +x.year,
                field: x.field,
                isTt: x.is_tt.toLowerCase(),
                rank: x.rank.split(', '),
                count: +x.count,
            };
        });
    }

    updateFields(fields: string[]): void {
        this.fields$.next(fields);
    }

    updateDataType(dataType: string): void {
        if (dataType.toLowerCase().includes('percent')) {
            this.dataType$.next('percent');
        } else {
            this.dataType$.next('count');
        }
    }

    updateTenureSelections(tenureSelections: AttributeSelection): void {
        this.tenureSelections$.next(tenureSelections);
    }

    updateRankSelections(rankSelections: AttributeSelection): void {
        this.rankSelections$.next(rankSelections);
    }

    updateYearsSelections(years: YearsSelection): void {
        this.yearsSelection$.next(years);
    }

    getColorForField(field: string): string {
        return artHistoryFields.find((x) => x.name.full === field).color;
    }

    transformYearsToDates(data: JobDatum[]): JobDatum[] {
        const array = [];
        data.forEach((x) => {
            x.year = new Date(`${x.year}-01-01T00:00:00Z`);
            array.push(x);
        });
        return data;
    }

    setLineChartData(): void {
        const lineDefs = this.getLineDefs();
        const chartData = lineDefs
            .map((def) => {
                const filteredData = this.getFilteredDataForLineDef(def);
                let reducedData = filteredData;
                if (def.rank !== 'all') {
                    const uniqueYears = [...new Set(filteredData.map((x) => x.year))];
                    reducedData = this.getAggregatedDataForRankByYear(reducedData, uniqueYears, filteredData, def);
                }
                if (this.selections.dataType === 'percent') {
                    reducedData.forEach((x) => {
                        this.setPercentValueOnDatum(x, def);
                    });
                }
                return reducedData;
            })
            .flat();

        this.updateLineChartData(chartData);
    }

    private updateLineChartData(data: JobDatum[]): void {
        this.lineChartData$.next(data);
    }

    private getAggregatedDataForRankByYear(
        reducedData: JobDatum[],
        uniqueYears: (number | Date)[],
        filteredData: JobDatum[],
        def: LineDef
    ) {
        reducedData = uniqueYears.map((year) => {
            const dataForYear = filteredData.filter((x) => x.year === year);
            let datumForYear = dataForYear[0];
            if (dataForYear.length > 1) {
                datumForYear.count = this.getSummedCountFromData(dataForYear);
            }
            datumForYear.rank = [def.rank];
            return datumForYear;
        });
        return reducedData;
    }

    private getSummedCountFromData(dataForYear: JobDatum[]): number {
        return dataForYear.reduce((acc, x) => {
            acc += x.count;
            return acc;
        }, 0);
    }

    private getFilteredDataForLineDef(def: LineDef): JobDatum[] {
        return this.data.filter((x) => x.field === def.field && x.isTt === def.tenure && x.rank.includes(def.rank));
    }

    setPercentValueOnDatum(x: JobDatum, def: LineDef): void {
        let allDatum;
        const dataForYear = this.data.filter((d) => d.year === x.year);
        if (this.lineChartCategoriesAccessor === 'isTt') {
            allDatum = dataForYear.filter(
                (d) => d.field === def.field && d.isTt === 'all' && d.rank.includes(def.rank)
            );
        } else if (this.lineChartCategoriesAccessor === 'rank') {
            allDatum = dataForYear.filter((d) => d.field === def.field && d.isTt === def.tenure && d.rank === ['all']);
        } else {
            allDatum = dataForYear.filter(
                (d) => d.field.toLowerCase() === 'all' && d.isTt === def.tenure && d.rank.includes(def.rank)
            );
        }
        x.percent = x.count / allDatum[0].count;
    }

    getLineDefs(): LineDef[] {
        const lines = [];
        for (let field of this.selections.fields) {
            for (let tenure of this.selections.tenure.selection) {
                for (let rank of this.selections.rank.selection) {
                    lines.push({ field, tenure, rank });
                }
            }
        }
        return lines;
    }

    setLineChartCategoriesAccessor(): void {
        if (this.selections.tenure.type === 'disaggregate') {
            this.lineChartCategoriesAccessor = 'isTt';
        } else if (this.selections.rank.type === 'disaggregate') {
            this.lineChartCategoriesAccessor = 'rank';
        } else {
            this.lineChartCategoriesAccessor = 'field';
        }
    }
}
