import { AfterViewInit, Component, ElementRef, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { scaleLinear } from 'd3';
import { cloneDeep } from 'lodash';
import { StackedAreaOptions } from 'src/app/shared/components/stacked-area-chart/stacked-area.model';
import { TableHeader } from 'src/app/shared/components/table/table.model';
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
    dataForTable: JobTableDatum[];
    stackedAreaOptions: StackedAreaOptions;

    constructor(private artHistoryJobsService: ArtHistoryJobsService) {}

    ngOnInit(): void {
        this.setDataForChart();
        this.setDataForTable();
        this.setAreaChartOptions();
    }

    ngAfterViewInit(): void {
        this.colorizeTable();
    }

    setDataForChart(): void {
        this.dataForChart = cloneDeep(this.artHistoryJobsService.data).filter(
            (x) => x.isTt === 'all' && x.rank[0] === 'all' && x.field !== 'All'
        );
    }

    setDataForTable(): void {
        const filteredData = cloneDeep(this.artHistoryJobsService.data).filter(
            (x) => x.isTt === 'all' && x.rank[0] === 'all'
        );
        const fields = artHistoryFields.map((x) => x.name.full);
        this.dataForTable = fields.map((field) => {
            const data = filteredData.filter((x) => x.field === field);
            const avg = data.reduce((acc, cur) => acc + cur.count, 0) / data.length;
            const currentValue = data.find((x) => x.year === this.currentYear).count;
            return {
                field,
                avg,
                current: currentValue,
            };
        });
    }

    setAreaChartOptions(): void {
        this.stackedAreaOptions = {
            x: (d) => d.year,
            y: (d) => d.count,
            z: (d) => d.field,
            width: 800,
            height: 600,
            order: this.getStackSortFunction(),
            colorScale: (d) => this.artHistoryJobsService.getColorForField(d),
            yLabel: 'number of jobs posted',
            xScaleType: scaleLinear,
            tooltipFormat: '.1f',
            xFormat: '.0f',
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

    getOrderedFields(rows: JobTableDatum[]): string[] {
        return rows
            .map((x) => x.field)
            .filter((x) => x !== 'All')
            .reverse();
    }

    handleTableSort(): void {
        this.stackedAreaOptions.order = this.getStackSortFunction();
    }
}
