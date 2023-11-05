import { NgModule } from '@angular/core';
import { FormatForIdPipe } from './format-for-id/format-for-id.pipe';
import { ResizeChartHeightPipe } from './resize-chart-height/resize-chart-height.pipe';
import { SentenceCasePipe } from './sentence-case/sentence-case.pipe';

@NgModule({
  declarations: [SentenceCasePipe, FormatForIdPipe, ResizeChartHeightPipe],
  exports: [SentenceCasePipe, FormatForIdPipe, ResizeChartHeightPipe],
  providers: [SentenceCasePipe],
})
export class PipesModule {}
