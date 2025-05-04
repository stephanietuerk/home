import { NgModule } from '@angular/core';
import { BarsClickDirective } from './bars-click.directive';
import { BarsHoverMoveDirective } from './bars-hover-move.directive';
import { BarsHoverDirective } from './bars-hover.directive';
import { BarsInputEventDirective } from './bars-input-event.directive';
import { BarsComponent } from './bars.component';

@NgModule({
  imports: [
    BarsComponent,
    BarsHoverDirective,
    BarsHoverMoveDirective,
    BarsInputEventDirective,
    BarsClickDirective,
  ],
  exports: [
    BarsComponent,
    BarsHoverDirective,
    BarsHoverMoveDirective,
    BarsInputEventDirective,
    BarsClickDirective,
  ],
})
export class VicBarsModule {}
