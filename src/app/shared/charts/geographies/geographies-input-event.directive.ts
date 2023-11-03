import { Directive, EventEmitter, Inject, Input, Output } from '@angular/core';
import { InputEventEffect } from '../events/effect';
import { InputEventDirective } from '../events/input-event';
import { GEOGRAPHIES, GeographiesComponent } from './geographies.component';

@Directive({
    selector: '[appGeographiesInputEffects]',
})
export class GeographiesInputEventDirective extends InputEventDirective {
    // eslint-disable-next-line @angular-eslint/no-input-rename
    @Input('appGeographiesInputEffects')
    effects: InputEventEffect<GeographiesInputEventDirective>[];
    @Output() inputEventOutput = new EventEmitter<any>();

    constructor(@Inject(GEOGRAPHIES) public geographies: GeographiesComponent) {
        super();
    }

    handleNewEvent(inputEvent: any): void {
        if (inputEvent) {
            this.effects.forEach((effect) => effect.applyEffect(this, inputEvent));
        } else {
            this.effects.forEach((effect) => effect.removeEffect(this, inputEvent));
        }
    }
}
