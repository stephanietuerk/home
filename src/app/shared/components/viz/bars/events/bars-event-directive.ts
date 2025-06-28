import { DataValue } from '../../core/types/values';
import { BarsComponent } from '../bars.component';
import { BarsHoverMoveDirective } from './bars-hover-move.directive';
import { BarsHoverDirective } from './bars-hover.directive';
import { BarsInputEventDirective } from './bars-input-event.directive';

export type BarsEventDirective<
  Datum,
  TOrdinalValue extends DataValue,
  TBarsComponent extends BarsComponent<Datum, TOrdinalValue> = BarsComponent<
    Datum,
    TOrdinalValue
  >,
> =
  | BarsHoverDirective<Datum, TOrdinalValue, TBarsComponent>
  | BarsHoverMoveDirective<Datum, TOrdinalValue, TBarsComponent>
  | BarsInputEventDirective<Datum, TOrdinalValue, TBarsComponent>;
