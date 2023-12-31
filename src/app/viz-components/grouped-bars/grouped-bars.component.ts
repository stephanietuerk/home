import {
  ChangeDetectionStrategy,
  Component,
  Input,
  ViewEncapsulation,
} from '@angular/core';
import { InternSet, range, scaleBand } from 'd3';
import { BarsComponent } from '../bars/bars.component';
import { DATA_MARKS } from '../data-marks/data-marks.token';
import { VicGroupedBarsConfig } from './grouped-bars.config';

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: '[vic-data-marks-grouped-bars]',
  templateUrl: '../bars/bars.component.html',
  styleUrls: ['./grouped-bars.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [{ provide: DATA_MARKS, useExisting: GroupedBarsComponent }],
})
export class GroupedBarsComponent extends BarsComponent {
  @Input() override config: VicGroupedBarsConfig;
  groupScale: any;

  override setValueIndicies(): void {
    // no unit test
    this.values.indicies = range(
      this.values[this.config.dimensions.ordinal].length
    ).filter((i) => {
      return (
        (this.config.ordinal.domain as InternSet).has(
          this.values[this.config.dimensions.ordinal][i]
        ) &&
        (this.config.category.domain as InternSet).has(this.values.category[i])
      );
    });
  }

  override drawMarks(): void {
    this.setGroupScale();
    super.drawMarks();
  }

  setGroupScale(): void {
    if (this.config.dimensions.ordinal === 'x') {
      this.groupScale = scaleBand(this.config.category.domain, [
        0,
        (this.scales.x as any).bandwidth(),
      ]).padding(this.config.intraGroupPadding);
    } else {
      this.groupScale = scaleBand(this.config.category.domain, [
        (this.scales.y as any).bandwidth(),
        0,
      ]).padding(this.config.intraGroupPadding);
    }
  }

  override getBarColor(i: number): string {
    return this.scales.category(this.values.category[i]);
  }

  override getBarXOrdinal(i: number): number {
    return (
      this.scales.x(this.values.x[i]) + this.groupScale(this.values.category[i])
    );
  }

  override getBarY(i: number): number {
    if (this.config.dimensions.ordinal === 'x') {
      return this.getBarYQuantitative(i);
    } else {
      return this.getBarYOrdinal(i);
    }
  }

  getBarYOrdinal(i: number): number {
    return (
      this.scales.y(this.values.y[i]) + this.groupScale(this.values.category[i])
    );
  }

  getBarYQuantitative(i: number): number {
    return this.scales.y(this.values.y[i]);
  }

  override getBarWidthOrdinal(i: number): number {
    return (this.groupScale as any).bandwidth();
  }

  override getBarHeightOrdinal(i: number): number {
    return (this.groupScale as any).bandwidth();
  }
}
