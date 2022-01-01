import { Directive, ElementRef, HostListener } from '@angular/core';
import { easeLinear, select, transition } from 'd3';
import { highlightLight, highlightPrimary } from '../../core/constants/colors.constants';

@Directive({
    selector: '[highlightRowOnHover]',
})
export class HighlightRowOnHoverDirective {
    constructor(private el: ElementRef) {}

    @HostListener('mouseenter') onMouseEnter() {
        this.highlightTds(highlightLight, highlightPrimary, 'pointer', '700');
    }

    @HostListener('mouseleave') onMouseLeave() {
        this.highlightTds(null, null, null, null);
    }

    private highlightTds(background: string, color: string, cursor: string, fontWeight: string) {
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
