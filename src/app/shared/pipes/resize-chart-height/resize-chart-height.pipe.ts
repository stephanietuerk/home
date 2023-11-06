import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'resizeChartHeight',
})
export class ResizeChartHeightPipe implements PipeTransform {
  transform(divWidth: any, maxHeight: number, maxWidth: number): number {
    if (typeof divWidth !== 'number') {
      return divWidth;
    } else if (divWidth < maxWidth) {
      const aspectRatio = maxWidth / maxHeight;
      return divWidth / aspectRatio;
    } else {
      return maxHeight;
    }
  }
}
