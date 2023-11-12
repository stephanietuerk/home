import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { BarsHoverMoveDirective } from './bars-hover-move.directive';
import { BarsHoverDirective } from './bars-hover.directive';
import { BarsInputEventDirective } from './bars-input-event.directive';
import { BarsComponent } from './bars.component';
import { BarsClickDirective } from './bars-click.directive';

@NgModule({
  declarations: [
    BarsComponent,
    BarsHoverDirective,
    BarsHoverMoveDirective,
    BarsInputEventDirective,
    BarsClickDirective,
  ],
  imports: [CommonModule],
  exports: [
    BarsComponent,
    BarsHoverDirective,
    BarsHoverMoveDirective,
    BarsInputEventDirective,
    BarsClickDirective,
  ],
})
export class VicBarsModule {}
