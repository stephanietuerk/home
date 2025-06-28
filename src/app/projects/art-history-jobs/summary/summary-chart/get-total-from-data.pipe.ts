import { Pipe, type PipeTransform } from '@angular/core';
import { StackedAreaTooltipDatum } from '../../../../shared/components/viz/stacked-area/stacked-area.component';
import { JobDatum } from '../../art-history-data.model';

@Pipe({
  name: 'appGetTotalFromData',
})
export class GetTotalFromDataPipe implements PipeTransform {
  transform(value: unknown, valueAccessor: 'count' | 'percent'): unknown {
    if (!value['data']) {
      return value;
    }
    return Math.round(
      (value['data'] as StackedAreaTooltipDatum<JobDatum, string>[]).reduce(
        (acc, curr) => {
          return acc + curr.datum[valueAccessor];
        },
        0
      )
    );
  }
}
