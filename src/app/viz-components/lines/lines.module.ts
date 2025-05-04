import { NgModule } from '@angular/core';
import { LinesClickDirective } from './lines-click.directive';
import { LinesHoverMoveDirective } from './lines-hover-move.directive';
import { LinesHoverDirective } from './lines-hover.directive';
import { LinesInputEventDirective } from './lines-input-event.directive';
import { LinesMarkerClickDirective } from './lines-marker-click.directive';
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
