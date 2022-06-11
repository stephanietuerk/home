import {
    AfterContentInit,
    AfterViewInit,
    ChangeDetectionStrategy,
    Component,
    ContentChild,
    ElementRef,
    EventEmitter,
    HostListener,
    Input,
    OnChanges,
    OnInit,
    Output,
    SimpleChanges,
    ViewChild,
} from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { takeUntil, throttleTime } from 'rxjs/operators';
import { ResizeChartHeightPipe } from 'src/app/shared/pipes/resize-chart-height/resize-chart-height.pipe';
import { UnsubscribeDirective } from 'src/app/shared/unsubscribe.directive';
import { DataMarksComponent } from '../data-marks/data-marks.model';
import { DATA_MARKS_COMPONENT } from '../data-marks/data-marks.token';
import { HtmlTooltipConfig } from '../html-tooltip/html-tooltip.model';
import { XYChartSpaceComponent } from '../xy-chart-space/xy-chart-space.component';
import { ElementSpacing } from '../xy-chart-space/xy-chart-space.model';

interface Svg {
    width: number;
    height: number;
}

@Component({
    selector: 'app-chart',
    templateUrl: './chart.component.html',
    styleUrls: ['./chart.component.scss'],
    providers: [ResizeChartHeightPipe],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChartComponent extends UnsubscribeDirective implements OnInit, OnChanges, AfterViewInit, AfterContentInit {
    @ContentChild(XYChartSpaceComponent) xySpace: XYChartSpaceComponent;
    @ContentChild(DATA_MARKS_COMPONENT) dataMarksComponent: DataMarksComponent;
    @ViewChild('div', { static: true }) divRef: ElementRef<HTMLDivElement>;
    @ViewChild('svg', { static: true }) svgRef: ElementRef<SVGSVGElement>;
    @Input() width = 800;
    @Input() height = 600;
    @Input() margin: ElementSpacing = {
        top: 36,
        right: 36,
        bottom: 36,
        left: 36,
    };
    @Input() scaleChartWithContainer = true;
    @Output() tooltipData = new EventEmitter<any>();
    sizeChange: BehaviorSubject<void> = new BehaviorSubject<void>(null);
    aspectRatio: number;
    htmlTooltip: HtmlTooltipConfig = new HtmlTooltipConfig();
    svg$: Observable<Svg>;
    svgWidth: number;
    svgHeight: number;

    @HostListener('window:resize', ['$event.target'])
    onResize() {
        if (this.chartShouldScale()) {
            this.sizeChange.next();
        }
    }

    ngOnInit(): void {
        this.setAspectRatio();
        this.subscribeToSizeChange();
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes['width'] || changes['height']) {
            this.setAspectRatio();
        }
    }

    ngAfterContentInit(): void {
        if (!this.dataMarksComponent) {
            throw new Error('DataMarksComponent not found.');
        }
    }

    ngAfterViewInit(): void {
        if (this.htmlTooltip.exists) {
            this.setTooltipPosition();
        }
    }

    subscribeToSizeChange() {
        this.sizeChange
            .asObservable()
            .pipe(throttleTime(100), takeUntil(this.unsubscribe))
            .subscribe(() => {
                this.resizeDataMarks();
            });
    }

    resizeDataMarks(): void {
        if (this.dataMarksComponent) {
            this.dataMarksComponent.resizeMarks();
        }
    }

    chartShouldScale(): boolean {
        return this.scaleChartWithContainer && this.divRef.nativeElement.offsetWidth <= this.width;
    }

    getSvgWidth(): any {
        return !this.scaleChartWithContainer ? this.width : this.divRef.nativeElement.offsetWidth;
    }

    setAspectRatio(): void {
        this.aspectRatio = this.width / this.height;
    }

    getScaledWidth(): number {
        return this.chartShouldScale() ? this.divRef.nativeElement.offsetWidth : this.width;
    }

    getScaledHeight(): number {
        return this.chartShouldScale() ? this.divRef.nativeElement.offsetWidth / this.aspectRatio : this.height;
    }

    getXRange(): [number, number] {
        return [this.margin.left, this.getScaledWidth() - this.margin.right];
    }

    getYRange(): [number, number] {
        return [this.getScaledHeight() - this.margin.bottom, this.margin.top];
    }

    onTouchStart(event: TouchEvent): void {
        event.preventDefault();
    }

    onPointerEnter(event: PointerEvent): void {
        this.dataMarksComponent.onPointerEnter(event);
    }

    onPointerLeave(event: PointerEvent): void {
        this.dataMarksComponent.onPointerLeave(event);
    }

    onPointerMove(event: PointerEvent): void {
        this.dataMarksComponent.onPointerMove(event);
    }

    onWheel(): void {
        if (this.htmlTooltip.exists) {
            this.setTooltipPosition();
        }
    }

    setTooltipPosition(): void {
        this.htmlTooltip.position.top = this.divRef.nativeElement.getBoundingClientRect().y;
        this.htmlTooltip.position.left = this.divRef.nativeElement.getBoundingClientRect().x;
    }

    emitTooltipData<T>(data: T): void {
        this.tooltipData.emit(data);
    }
}
