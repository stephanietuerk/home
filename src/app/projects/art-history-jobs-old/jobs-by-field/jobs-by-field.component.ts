import { AfterViewInit, Component, ElementRef, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { scaleLinear } from 'd3';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Sort } from 'src/app/core/enums/sort.enum';
import { SortService } from 'src/app/core/services/sort.service';
import { StackedAreaChartOptions } from 'src/app/shared/components/stacked-area-chart/stacked-area-chart.model';
import { TableHeader } from 'src/app/shared/components/table/table.model';
import { ArtHistoryDataService } from '../art-history-data.service';
import { artHistoryFields, tableHeaders } from '../art-history-jobs.constants';
import { ArtHistoryJobsService } from '../art-history-jobs.service';
import { JobDatum, JobTableDatum } from '../models/art-history-data';
import { ArtHistoryTableComponent } from './art-history-table/art-history-table.component';

@Component({
    selector: 'app-jobs-by-field',
    templateUrl: './jobs-by-field.component.html',
    styleUrls: ['./jobs-by-field.component.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class JobsByFieldComponent implements OnInit, AfterViewInit {
    @ViewChild('stackedBar') stackedBarEl: ElementRef;
    @ViewChild('table', { read: ElementRef }) tableEl: ElementRef;
    @ViewChild('table', { read: ArtHistoryTableComponent }) tableComponent: ArtHistoryTableComponent;
    currentYear = 2021;
    tableHeaders: TableHeader[] = tableHeaders;
    dataForChart: JobDatum[];
    chartData$: Observable<JobDatum[]>;
    dataForTable: JobTableDatum[];
    tableData$: Observable<JobTableDatum[]>;
    dataYears$: Observable<number[]>;
    stackedAreaChartOptions: StackedAreaChartOptions;

    constructor(
        private dataService: ArtHistoryDataService,
        private artHistoryJobsService: ArtHistoryJobsService,
        private sortService: SortService
    ) {}

    ngOnInit(): void {
        const data$ = this.dataService.getData();
        this.chartData$ = data$.pipe(map((data) => this.getChartData(data)));
        this.tableData$ = data$.pipe(map((data) => this.getTableData(data)));
        this.setAreaChartOptions();
    }

    ngAfterViewInit(): void {
        this.colorizeTable();
    }

    getChartData(data: JobDatum[]): JobDatum[] {
        return data.filter((x) => x.isTt === 'all' && x.rank[0] === 'all' && x.field !== 'All');
    }

    getTableData(data: JobDatum[]): JobTableDatum[] {
        const filteredData = data.filter((x) => x.isTt === 'all' && x.rank[0] === 'all');
        const fields = artHistoryFields.map((x) => x.name.full);
        const tableData = fields.map((field) => {
            const fieldData = filteredData.filter((x) => x.field === field);
            const avg = fieldData.reduce((acc, cur) => acc + cur.count, 0) / fieldData.length;
            const currentValue = fieldData.find((x) => x.year === this.currentYear).count;
            return {
                field,
                avg,
                current: currentValue,
            };
        });
        this.sortTableData(tableData);
        return tableData;
    }

    sortTableData(data: JobTableDatum[]): void {
        const sortHeader = this.tableHeaders.find((h) => h.sort.direction !== null);
        data.sort((a, b) =>
            this.sortService.valueCompare(sortHeader.sort.direction === Sort.asc, a[sortHeader.id], b[sortHeader.id])
        );
    }

    setAreaChartOptions(): void {
        this.stackedAreaChartOptions = {
            x: (d) => d.year,
            y: (d) => d.count,
            z: (d) => d.field,
            width: 800,
            height: 614,
            xScaleType: scaleLinear,
            order: this.getStackSortFunction(),
            keyOrder: this.getKeyOrder(),
            xFormat: '.0f',
            yLabel: 'number of jobs posted',
            colorScale: (d) => this.artHistoryJobsService.getColorForField(d),
            showTooltip: true,
            tooltipFormat: '.1f',
        };
    }

    colorizeTable(): void {
        this.tableEl.nativeElement.querySelectorAll('tbody tr').forEach((tr) => {
            const field = tr.querySelector('th').innerText;
            tr.querySelectorAll('.cell').forEach((cell) => {
                cell.style.color = this.artHistoryJobsService.getColorForField(field);
            });
        });
    }

    getStackSortFunction(): any {
        const rows = this.tableComponent ? this.tableComponent.rows : this.dataForTable;
        const orderedFields = this.getOrderedFields(rows);
        return (series: any): number[] => {
            let n = series.length;
            const o = new Array(n);
            const fields = orderedFields;
            while (--n >= 0) {
                o[fields.indexOf(series[n].key)] = n;
            }
            return o;
        };
    }

    getKeyOrder(): string[] {
        const rows = this.tableComponent ? this.tableComponent.rows : this.dataForTable;
        return rows.map((x) => x.field).filter((x) => x !== 'All');
    }

    getOrderedFields(rows: JobTableDatum[]): string[] {
        return rows
            .map((x) => x.field)
            .filter((x) => x !== 'All')
            .reverse();
    }

    handleTableSort(): void {
        this.stackedAreaChartOptions.keyOrder = this.getKeyOrder();
    }
}
