import {
    ChangeDetectionStrategy,
    Component,
    ElementRef,
    EventEmitter,
    inject,
    InjectionToken,
    Input,
    NgZone,
    OnChanges,
    OnInit,
    Output,
    SimpleChanges,
    ViewChild,
    ViewEncapsulation,
} from '@angular/core';
import { InternSet, max, range, scaleOrdinal } from 'd3';
import { UtilitiesService } from '../core/services/utilities.service';
import { DATA_MARKS } from '../data-marks/data-marks.token';
import { OrdinalDataMarksValues, OrdinalQuantitativeDataMarks } from '../data-marks/ordinal-quantitative-data-marks';
import { OrdinalQuantitativeContent } from '../ordinal-quantitative-chart/ordinal-quantitative-content';
import { DataDomainService } from '../utilities/data-domain.service';
import { UnitsConfig } from './units.config';

export const UNITS = new InjectionToken<UnitsComponent>('BarsComponent');

@Component({
    selector: '[data-marks-unit]',
    templateUrl: './units.component.html',
    styleUrls: ['./units.component.scss'],
    encapsulation: ViewEncapsulation.None,
    providers: [{ provide: DATA_MARKS, useExisting: UnitsComponent }],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UnitsComponent
    extends OrdinalQuantitativeContent
    implements OrdinalQuantitativeDataMarks, OnChanges, OnInit
{
    drawMarks: (transitionDuration: number) => void;
    @ViewChild('units', { static: true }) unitsRef: ElementRef<SVGSVGElement>;
    @Input() config: UnitsConfig;
    @Output() tooltipData = new EventEmitter<any>();
    private utilities = inject(UtilitiesService);
    private dataDomainService = inject(DataDomainService);
    private zone = inject(NgZone);
    values: OrdinalDataMarksValues = new OrdinalDataMarksValues();
    unitGroups: any;
    unitsKeyFunction: (i: number) => string;

    ngOnChanges(changes: SimpleChanges): void {
        // if (this.utilities.objectOnNgChangesChangedNotFirstTime(changes, 'config')) {
        //     this.setMethodsFromConfigAndDraw();
        // }
    }

    ngOnInit(): void {
        // this.subscribeToRanges();
        // this.subscribeToScales();
        // this.setMethodsFromConfigAndDraw();
    }

    setMethodsFromConfigAndDraw(): void {
        // this.setValueArrays();
        // this.initNonQuantitativeDomains();
        // this.setValueIndicies();
        // this.initQuantitativeDomain();
        // this.initCategoryScale();
        // this.setScaledSpaceProperties();
        // this.setUnitsKeyFunction();
        // this.drawMarks(this.chart.transitionDuration);
    }

    resizeMarks(): void {
        // this.setScaledSpaceProperties();
        // this.drawMarks(0);
    }

    setValueArrays(): void {
        // this.values.ordinal = map(this.config.data, this.config[this.config.dimensions.x].valueAccessor);
        // this.values.category = map(this.config.data, this.config.category.valueAccessor);
    }

    initNonQuantitativeDomains(): void {
        if (this.config.ordinal.domain === undefined) {
            this.config.ordinal.domain = this.values[this.config.dimensions.ordinal];
        }
        if (this.config.category.domain === undefined) {
            this.config.category.domain = this.values.category;
        }
        const ordinalDomain =
            this.config.dimensions.ordinal === 'x'
                ? this.config.ordinal.domain
                : (this.config.ordinal.domain as any[]).slice().reverse();
        this.config.ordinal.domain = new InternSet(ordinalDomain);
        this.config.category.domain = new InternSet(this.config.category.domain);
    }

    setValueIndicies(): void {
        this.values.indicies = range(this.values[this.config.dimensions.ordinal].length).filter((i) =>
            (this.config.ordinal.domain as InternSet).has(this.values[this.config.dimensions.ordinal][i])
        );
    }

    initQuantitativeDomain(): void {
        if (this.config.quantitative.domain === undefined) {
            const dataByOrdinalValue = this.values.ordinal.map((v) =>
                this.config.data.filter((x) => this.config.ordinal.valueAccessor(x) === v)
            );
            const dataMax = max(dataByOrdinalValue.map((x) => x.length));
            const domainMin = 0;
            const domainMax = this.dataDomainService.getPaddedDomainValue(
                dataMax,
                this.config.quantitative.domainPadding
            );
            if (domainMin === domainMax) {
                this.config.quantitative.domain = [domainMin, domainMin + 1];
            } else {
                this.config.quantitative.domain = [domainMin, domainMax];
            }
        }
    }

    initCategoryScale(): void {
        if (this.config.category.colorScale === undefined) {
            this.config.category.colorScale = scaleOrdinal(
                new InternSet(this.config.category.domain),
                this.config.category.colors
            );
        }
    }

    setScaledSpaceProperties(): void {
        this.zone.run(() => {
            this.chart.updateOrdinalScale(this.getOrdinalScale());
            this.chart.updateQuantitativeScale(this.getQuantitativeScale());
        });
    }

    getOrdinalScale(): any {
        return this.config.ordinal
            .scaleType(this.config.ordinal.domain, this.ranges[this.config.dimensions.ordinal])
            .paddingInner(this.config.ordinal.paddingInner)
            .paddingOuter(this.config.ordinal.paddingOuter)
            .align(this.config.ordinal.align);
    }

    getQuantitativeScale(): any {
        return this.config.quantitative.scaleType(
            this.config.quantitative.domain,
            this.ranges[this.config.dimensions.quantitative]
        );
    }

    setUnitsKeyFunction(): void {
        this.unitsKeyFunction = (i: number): string => `${this.values[this.config.dimensions.ordinal][i]}`;
    }

    drawUnits(transitionDuration: number): void {
        // const t = select(this.chart.svgRef.nativeElement).transition().duration(transitionDuration) as Transition<
        //     SVGSVGElement,
        //     any,
        //     any,
        //     any
        // >;
        // this.unitGroups = select(this.unitsRef.nativeElement)
        //     .selectAll('.vic-units-group')
        //     .data(this.values.indicies, this.unitsKeyFunction)
        //     .join(
        //         (enter) =>
        //             enter
        //                 .append('g')
        //                 .attr('class', 'vic-bar-group')
        //                 .attr('transform', (i) => {
        //                     const x = this.getUnitGroupX(i);
        //                     const y = this.getUnitGroupY(i);
        //                     return `translate(${x},${y})`;
        //                 }),
        //         (update) =>
        //             update.call((update) =>
        //                 update.transition(t as any).attr('transform', (i) => {
        //                     const x = this.getUnitGroupX(i);
        //                     const y = this.getUnitGroupY(i);
        //                     return `translate(${x},${y})`;
        //                 })
        //             ),
        //         (exit) => exit.remove()
        //     );
        // this.unitGroups
        //     .selectAll('.vic-unit')
        //     .data((i: number) => [i])
        //     .join(
        //         (enter) =>
        //             enter
        //                 .append('rect')
        //                 .attr('class', 'vic-unit')
        //                 .property('key', (i) => this.values[this.config.dimensions.ordinal][i])
        //                 .attr('fill', (i) =>
        //                     this.config.patternPredicates
        //                         ? this.getUnitPattern(i as number)
        //                         : this.getUnitColor(i as number)
        //                 )
        //                 .attr('width', (i) => this.getUnitGroupWidth(i as number))
        //                 .attr('height', (i) => this.getBarHeight(i as number)),
        //         (update) =>
        //             update.call((update) =>
        //                 update
        //                     .transition(t as any)
        //                     .attr('width', (i) => this.getUnitGroupWidth(i as number))
        //                     .attr('height', (i) => this.getBarHeight(i as number))
        //                     .attr('fill', (i) =>
        //                         this.config.patternPredicates
        //                             ? this.getBarPattern(i as number)
        //                             : this.getBarColor(i as number)
        //                     )
        //             ),
        //         (exit) => exit.remove()
        //     );
    }

    getUnitGroupX(i: number): number {
        if (this.config.dimensions.ordinal === 'x') {
            return this.getUnitGroupXOrdinal(i);
        } else {
            return this.getUnitGroupXQuantitative(i);
        }
    }

    getUnitGroupXOrdinal(i: number): number {
        return this.ordinalScale(this.values.ordinal[i]);
    }

    getUnitGroupXQuantitative(i: number): number {
        return this.quantitativeScale(this.config.quantitative.domain[0]);
    }

    // getUnitGroupY(i: number): number {
    //     return this.yScale(this.values.y[i]);
    // }

    // getUnitGroupWidth(i: number): number {
    //     let width;
    //     if (this.config.dimensions.ordinal === 'x') {
    //         width = this.getBarWidthOrdinal(i);
    //     } else {
    //         width = this.getBarWidthQuantitative(i);
    //     }
    //     if (!width || isNaN(width)) {
    //         width = 0;
    //     }
    //     return width;
    // }
}
