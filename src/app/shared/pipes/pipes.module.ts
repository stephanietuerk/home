import { NgModule } from '@angular/core';
import { AsPipe } from './as/as.pipe';
import { FormatForIdPipe } from './format-for-id/format-for-id.pipe';
import { ResizeChartHeightPipe } from './resize-chart-height/resize-chart-height.pipe';
import { SentenceCasePipe } from './sentence-case/sentence-case.pipe';

@NgModule({
    declarations: [SentenceCasePipe, FormatForIdPipe, ResizeChartHeightPipe, AsPipe],
    exports: [SentenceCasePipe, FormatForIdPipe, ResizeChartHeightPipe, AsPipe],
    providers: [SentenceCasePipe],
})
export class PipesModule {}
