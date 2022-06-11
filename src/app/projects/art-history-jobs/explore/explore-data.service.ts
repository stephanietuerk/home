import { Injectable } from '@angular/core';
import { BehaviorSubject, combineLatest, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { JobDatum, LineDef } from '../art-history-data.model';
import { ArtHistoryDataService } from '../art-history-data.service';
import { ExploreSelections } from './explore-selections/explore-selections.model';
import { ExploreTimeRangeChartData } from './explore-time-range-chart/explore-time-range-chart.model';

@Injectable({
    providedIn: 'root',
})
export class ExploreDataService {
    selections: BehaviorSubject<ExploreSelections> = new BehaviorSubject(null);
    selections$ = this.selections.asObservable();
    timeRangeChartData$: Observable<ExploreTimeRangeChartData>;

    constructor(private artHistoryDataService: ArtHistoryDataService) {
        const data$ = this.artHistoryDataService.getData();
        this.timeRangeChartData$ = combineLatest([this.selections$, data$]).pipe(
            map(([selections, data]) => {
                if (selections && data) {
                    return {
                        data: selections ? this.getLineChartDataForSelections(selections, data) : null,
                        dataType: selections ? selections.dataType : null,
                        categories: selections ? this.getLineChartCategoriesAccessor(selections) : null,
                    };
                }
            })
        );
    }

    private getLineChartDataForSelections(selections: ExploreSelections, data: JobDatum[]): JobDatum[] {
        const lineDefs = this.getLineDefs(selections);
        const dataForSelections = lineDefs
            .map((lineDef) => {
                const filteredData = this.getFilteredDataForLineDef(lineDef, data);
                let aggregatedData = filteredData;
                if (lineDef.rank !== 'all') {
                    aggregatedData = this.getAggregatedDataForRankByYear(aggregatedData, filteredData, lineDef);
                }
                if (selections.dataType === 'percent') {
                    const categoriesAccessor = this.getLineChartCategoriesAccessor(selections);
                    aggregatedData.forEach((x) => {
                        this.setPercentValueOnDatum(x, lineDef, data, categoriesAccessor);
                    });
                }
                return aggregatedData;
            })
            .flat();
        return dataForSelections;
    }

    private getLineDefs(selections: ExploreSelections): LineDef[] {
        const lines = [];
        for (let field of selections.fields) {
            for (let isTt of selections.tenureValues) {
                for (let rank of selections.rankValues) {
                    lines.push({ field, isTt, rank });
                }
            }
        }
        return lines;
    }

    private getFilteredDataForLineDef(def: LineDef, data: JobDatum[]): JobDatum[] {
        return data.filter((x) => x.field === def.field && x.isTt === def.isTt && x.rank.includes(def.rank));
    }

    private getAggregatedDataForRankByYear(data: JobDatum[], filteredData: JobDatum[], def: LineDef) {
        const uniqueYears = [...new Set(filteredData.map((x) => x.year.getFullYear()))];
        data = uniqueYears.map((year) => {
            const dataForYear = filteredData.filter((x) => x.year.getFullYear() === year);
            const datumForYear = dataForYear[0];
            if (dataForYear.length > 1) {
                datumForYear.count = this.getSummedCountFromData(dataForYear);
            }
            datumForYear.rank = [def.rank];
            return datumForYear;
        });
        return data;
    }

    private getSummedCountFromData(data: JobDatum[]): number {
        return data.reduce((acc, x) => {
            acc += x.count;
            return acc;
        }, 0);
    }

    private getLineChartCategoriesAccessor(selections: ExploreSelections): 'field' | 'isTt' | 'rank' {
        if (selections.tenureUse === 'disaggregate') {
            return 'isTt';
        } else if (selections.rankUse === 'disaggregate') {
            return 'rank';
        } else {
            return 'field';
        }
    }

    private setPercentValueOnDatum(x: JobDatum, def: LineDef, allData: JobDatum[], categoriesAccessor: string): void {
        let allDatum;
        const dataForYear = allData.filter((d) => d.year.getFullYear() === x.year.getFullYear());
        if (categoriesAccessor === 'isTt') {
            allDatum = dataForYear.filter(
                (d) => d.field === def.field && d.isTt === 'all' && d.rank.includes(def.rank)
            );
        } else if (categoriesAccessor === 'rank') {
            allDatum = dataForYear.filter((d) => d.field === def.field && d.isTt === def.isTt && d.rank === ['all']);
        } else {
            allDatum = dataForYear.filter(
                (d) => d.field.toLowerCase() === 'all' && d.isTt === def.isTt && d.rank.includes(def.rank)
            );
        }
        x.percent = x.count / allDatum[0].count;
    }

    updateSelections(selections: ExploreSelections): void {
        this.selections.next(selections);
    }
}
