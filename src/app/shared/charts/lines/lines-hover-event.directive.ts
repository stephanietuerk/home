import { Directive, Inject, Input } from '@angular/core';
import { EventEffect } from '../events/effect';
import { HoverEventDirective } from '../events/hover-event';
import { LINES, LinesComponent } from './lines.component';

@Directive({
    selector: '[appLinesHoverEffects]',
})
export class LinesHoverEventDirective extends HoverEventDirective {
    // eslint-disable-next-line @angular-eslint/no-input-rename
    @Input('appLinesHoverEffects')
    effects: EventEffect<LinesHoverEventDirective>[];

    constructor(@Inject(LINES) public lines: LinesComponent) {
        super();
    }

    setListenedElements(): void {
        this.elements = [this.lines.chart.svgRef.nativeElement];
        this.setListeners();
    }

    elementPointerEnter(): void {
        this.effects.forEach((effect) => effect.applyEffect(this));
    }

    elementPointerLeave(): void {
        this.effects.forEach((effect) => effect.removeEffect(this));
    }
}
