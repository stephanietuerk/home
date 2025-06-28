import { LinesComponent } from '../lines.component';
import { LinesHoverMoveDirective } from './lines-hover-move.directive';
import { LinesHoverDirective } from './lines-hover.directive';
import { LinesInputEventDirective } from './lines-input-event.directive';

export type LinesEventDirective<
  Datum,
  ExtendedLinesComponent extends LinesComponent<Datum> = LinesComponent<Datum>,
> =
  | LinesHoverDirective<Datum, ExtendedLinesComponent>
  | LinesHoverMoveDirective<Datum, ExtendedLinesComponent>
  | LinesInputEventDirective<Datum, ExtendedLinesComponent>;
