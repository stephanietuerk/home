import { Directive, ElementRef, Input, ViewChild } from '@angular/core';
import { format, select, timeFormat } from 'd3';
import { UnsubscribeDirective } from 'src/app/shared/unsubscribe.directive';
import { SvgUtilities } from '../utilities/svg-utilities.class';
import { SvgWrapOptions } from '../utilities/svg-utilities.model';
import { AxisConfig, TickWrap } from './axis-config.model';

@Directive()
export abstract class XYAxisElement extends UnsubscribeDirective {
    @ViewChild('axis', { static: true }) axisRef: ElementRef<SVGGElement>;
    @Input() config: AxisConfig;
    axis: any;
    scale: any;

    abstract subscribeToScale(): void;

    updateAxis(): void {
        const axisFunction = this.getAxisFunction();
        this.setAxis(axisFunction);
        this.setTranslate();
        this.drawAxis();
        this.processAxisFeatures();
    }

    setAxis(axisFunction: any): void {
        if (this.config.dimensionType === 'ordinal') {
            this.axis = axisFunction(this.scale).tickSizeOuter(this.config.tickSizeOuter);
        } else {
            const numTicks = this.config.numTicks || this.initNumTicks();
            this.axis = axisFunction(this.scale);
            if (this.config.tickValues) {
                this.axis.tickValues(this.config.tickValues).tickFormat((d) => {
                    const formatter = d instanceof Date ? timeFormat : format;
                    return formatter(this.config.tickFormat)(d);
                });
            } else {
                this.axis.ticks(numTicks, this.config.tickFormat);
            }
        }
    }

    abstract getAxisFunction(): any;
    abstract initNumTicks(): number;
    abstract setTranslate(): void;

    drawAxis(): void {
        select(this.axisRef.nativeElement).call(this.axis);

        if (this.config.tickLabelFontSize) {
            select(this.axisRef.nativeElement).selectAll('.tick text').attr('font-size', this.config.tickLabelFontSize);
        }

        if (this.config.wrap) {
            this.wrapAxisTickText(this.config.wrap);
        }
    }

    processAxisFeatures(): void {
        if (this.config.removeDomain) {
            select(this.axisRef.nativeElement).call((g) => g.select('.domain').remove());
        }
        if (this.config.removeTicks) {
            select(this.axisRef.nativeElement).call((g) => g.selectAll('.tick').remove());
        }
        if (this.config.removeTickMarks) {
            select(this.axisRef.nativeElement).call((g) => g.selectAll('.tick line').remove());
        }
    }

    wrapAxisTickText(options: TickWrap): void {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { wrapWidth, ...properties } = options;
        const config = Object.assign(new SvgWrapOptions(), properties) as SvgWrapOptions;
        config.width = options.wrapWidth === 'bandwidth' ? this.scale.bandwidth() : options.wrapWidth;
        select(this.axisRef.nativeElement).selectAll('.tick text').call(SvgUtilities.textWrap, config);
    }
}
