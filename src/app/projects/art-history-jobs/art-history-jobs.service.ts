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
import { ArtHistorySelections, AttributeSelection, YearsSelection } from './models/art-history-config';
import { JobDatum } from './models/art-history-data';

const initSelections: ArtHistorySelections = {
    fields: artHistoryFields.filter((x) => x.selected).map((x) => x.name.full),
    dataType: dataTypeOptions.find((x) => x.selected).value as 'percent' | 'count',
    tenure: {
        type: tenureFilterOptions.find((x) => x.selected).value as 'filter' | 'disaggregate',
        selection: ['all'],
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

    constructor(private resource: ArtHistoryJobsResource) {
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
                    this.filterData();
                }
            }
        );
    }

    getData(): Promise<void> {
        return new Promise((resolve, reject) => {
            this.resource.getData().subscribe((data) => {
                this.data = this.parseData(data);
                this.filterData();
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
        const updatedFields = this.fields$.value;
        fields.forEach((field) => {
            const fieldOption = updatedFields.find((x) => x === field);
            if (!fieldOption) {
                updatedFields.push(field);
            } else {
                updatedFields.splice(updatedFields.indexOf(field), 1);
            }
        });
        this.fields$.next(updatedFields);
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

    filterData(): void {
        // const dataForFields = this.data.filter((x) => this.selections.fields.includes(x.field));
        // const dataForYears = dataForFields.filter(
        //     (x) => x.year >= this.selections.years.start && x.year <= this.selections.years.end
        // );
        // const dataForTenure = dataForYears.filter((x) => this.selections.tenure.selection.includes(x.isTt));
        // const dataForRank = dataForTenure.filter((x) => {
        //     const rank = x.rank.filter((r) => this.selections.rank.selection.includes(r));
        //     return rank.length > 0;
        // });
        this.setLineChartData();
    }

    setLineChartData(): void {
        const lineDefs = this.getLineDefs();
        console.log(lineDefs);
    }

    getLineDefs(): any[] {
        const lines = [];
        for (let field of this.selections.fields) {
            for (let tt of this.selections.tenure.selection) {
                for (let rank of this.selections.rank.selection) {
                    lines.push([field, tt, rank]);
                }
            }
        }
        return lines;
    }
}
