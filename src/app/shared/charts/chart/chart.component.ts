import {
  AfterContentInit,
  ChangeDetectionStrategy,
  Component,
  ContentChild,
  ElementRef,
  Input,
  OnChanges,
  OnInit,
  Renderer2,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { min } from 'd3';
import {
  combineLatest,
  distinctUntilChanged,
  map,
  merge,
  Observable,
  of,
  shareReplay,
  startWith,
  Subject,
  throttleTime,
} from 'rxjs';
import { DataMarks } from '../data-marks/data-marks';
import { DATA_MARKS } from '../data-marks/data-marks.token';
import { Chart } from './chart';
import { CHART } from './chart.token';

export interface Ranges {
  x: [number, number];
  y: [number, number];
}

export interface ElementSpacing {
  top: number;
  right: number;
  bottom: number;
  left: number;
}

export interface Dimensions {
  width: number;
  height: number;
}
@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [{ provide: CHART, useExisting: ChartComponent }],
})
export class ChartComponent
  implements Chart, OnInit, OnChanges, AfterContentInit
{
  @ContentChild(DATA_MARKS)
  dataMarksComponent: DataMarks;
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
  @Input() scaleChartWithContainerWidth = { width: true, height: true };
  @Input() transitionDuration?: number = 250;
  aspectRatio: number;
  svgDimensions$: Observable<Dimensions>;
  ranges$: Observable<Ranges>;
  heightSubject = new Subject<number>();
  height$ = this.heightSubject.asObservable();
  resizeThrottleTime = 100;

  constructor(private renderer: Renderer2) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['width'] || changes['height']) {
      this.setAspectRatio();
    }
    if (changes['height']) {
      this.heightSubject.next(this.height);
    }
  }

  ngOnInit(): void {
    this.setAspectRatio();
    this.createDimensionObservables();
  }

  ngAfterContentInit(): void {
    if (!this.dataMarksComponent) {
      throw new Error('DataMarksComponent not found.');
    }
  }

  setAspectRatio(): void {
    this.aspectRatio = this.width / this.height;
  }

  createDimensionObservables() {
    let divWidth$: Observable<number>;

    const width$ = of(min([this.divRef.nativeElement.offsetWidth, this.width]));

    if (this.scaleChartWithContainerWidth.width) {
      divWidth$ = merge(width$, this.getDivWidthResizeObservable()).pipe(
        throttleTime(this.resizeThrottleTime),
        distinctUntilChanged()
      );
    } else {
      divWidth$ = of(this.width);
    }

    const height$ = this.height$.pipe(startWith(this.height));

    this.svgDimensions$ = combineLatest([divWidth$, height$]).pipe(
      map(([divWidth]) => this.getSvgDimensionsFromDivWidth(divWidth))
    );

    this.ranges$ = this.svgDimensions$.pipe(
      map((dimensions) => this.getRangesFromSvgDimensions(dimensions)),
      shareReplay()
    );
  }

  getDivWidthResizeObservable(): Observable<number> {
    const el = this.divRef.nativeElement;
    return new Observable((subscriber) => {
      const observer = new ResizeObserver((entries) => {
        subscriber.next(entries[0].contentRect.width);
      });
      observer.observe(el);
      return function unsubscribe() {
        observer.unobserve(el);
        observer.disconnect();
      };
    });
  }

  getSvgDimensionsFromDivWidth(divWidth: any) {
    const width = this.getSvgWidthFromDivWidth(divWidth);
    const height = this.getSvgHeightFromWidth(width);
    return { width, height };
  }

  getSvgWidthFromDivWidth(divWidth: number): any {
    return !this.scaleChartWithContainerWidth.width ? this.width : divWidth;
  }

  getSvgHeightFromWidth(width: number): number {
    return this.scaleChartWithContainerWidth.height &&
      this.divRef.nativeElement.offsetWidth <= this.width
      ? width / this.aspectRatio
      : this.height;
  }

  getRangesFromSvgDimensions(dimensions: Dimensions): Ranges {
    const xRange: [number, number] = [
      this.margin.left,
      dimensions.width - this.margin.right,
    ];
    const yRange: [number, number] = [
      dimensions.height - this.margin.bottom,
      this.margin.top,
    ];
    return { x: xRange, y: yRange };
  }
}
