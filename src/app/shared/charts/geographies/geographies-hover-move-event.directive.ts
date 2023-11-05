import { Directive, EventEmitter, Inject, Input, Output } from '@angular/core';
import { select } from 'd3';
import { filter, takeUntil } from 'rxjs/operators';
import { EventEffect } from '../events/effect';
import { HoverAndMoveEventDirective } from '../events/hover-move-event';
import { GEOGRAPHIES, GeographiesComponent } from './geographies.component';

export class GeographiesHoverAndMoveEmittedOutput {
  datum?: any;
  color: string;
  geography: string;
  attributeValue: string;
  positionX?: number;
  positionY?: number;
}
@Directive({
  selector: '[appGeographiesHoverAndMoveEffects]',
})
export class GeographiesHoverAndMoveEventDirective extends HoverAndMoveEventDirective {
  // eslint-disable-next-line @angular-eslint/no-input-rename
  @Input('appGeographiesHoverAndMoveEffects')
  effects: EventEffect<GeographiesHoverAndMoveEventDirective>[];
  @Output() hoverAndMoveEventOutput =
    new EventEmitter<GeographiesHoverAndMoveEmittedOutput>();
  pointerX: number;
  pointerY: number;
  geographyIndex: number;

  constructor(@Inject(GEOGRAPHIES) public geographies: GeographiesComponent) {
    super();
  }

  setListenedElements(): void {
    this.geographies.dataGeographies$
      .pipe(
        takeUntil(this.unsubscribe),
        filter((geoSels) => !!geoSels)
      )
      .subscribe((geoSels) => {
        this.elements = geoSels.nodes();
        this.setListeners();
      });
  }

  elementPointerEnter(): void {
    return;
  }

  elementPointerMove(event: PointerEvent): void {
    [this.pointerX, this.pointerY] = this.getPointerValuesArray(event);
    const d = select(event.target as Element).datum();
    this.geographyIndex = this.getGeographyIndex(d);
    if (this.effects) {
      this.effects.forEach((effect) => effect.applyEffect(this));
    }
  }

  elementPointerLeave(): void {
    if (this.effects) {
      this.effects.forEach((effect) => effect.removeEffect(this));
    }
  }

  getGeographyIndex(d: any): number {
    let value = this.geographies.config.dataGeographyConfig.valueAccessor(d);
    if (typeof value === 'string') {
      value = value.toLowerCase();
    }
    return this.geographies.values.indexMap.get(value);
  }
}
