import { Directive, ElementRef, HostListener } from '@angular/core';
import { easeLinear, select, transition } from 'd3';
import { darkPrimary, highlightPrimary } from '../../core/constants/colors.contants';
import { ColorService } from '../../core/services/color.service';

@Directive({
    selector: '[appRowHover]',
})
export class RowHoverDirective {
    constructor(private el: ElementRef, private colorService: ColorService) {}

    @HostListener('mouseenter') onMouseEnter() {
        this.highlight(this.colorService.hexToRGBA(darkPrimary, 0.04), highlightPrimary, 'pointer', '700');
        this.el.nativeElement;
    }

    @HostListener('mouseleave') onMouseLeave() {
        this.highlight(null, null, null, null);
    }

    private highlight(background: string, color: string, cursor: string, fontWeight: string) {
        const row = this.el.nativeElement.parentNode;
        const t = transition().duration(100).ease(easeLinear);
        select(row)
            .selectAll('td')
            .transition(t)
            .style('background', background)
            .style('color', color)
            .style('cursor', cursor)
            .style('font-weight', fontWeight);

        select(row).selectAll('svg').transition(t).style('fill', color).style('stroke', color);
    }
}
