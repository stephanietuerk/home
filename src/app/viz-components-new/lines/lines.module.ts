import { NgModule } from '@angular/core';
import { LinesClickDirective } from './events/lines-click.directive';
import { LinesHoverMoveDirective } from './events/lines-hover-move.directive';
import { LinesHoverDirective } from './events/lines-hover.directive';
import { LinesInputEventDirective } from './events/lines-input-event.directive';
import { LinesMarkerClickDirective } from './events/lines-marker-click.directive';
import { LinesComponent } from './lines.component';

@NgModule({
  imports: [
    LinesComponent,
    LinesMarkerClickDirective,
    LinesClickDirective,
    LinesHoverMoveDirective,
    LinesInputEventDirective,
    LinesHoverDirective,
  ],
  exports: [
    LinesComponent,
    LinesMarkerClickDirective,
    LinesClickDirective,
    LinesHoverDirective,
    LinesHoverMoveDirective,
    LinesInputEventDirective,
  ],
})
export class VicLinesModule {}
