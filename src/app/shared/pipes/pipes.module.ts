import { NgModule } from '@angular/core';
import { FormatForIdPipe } from './format-for-id/format-for-id.pipe';
import { SentenceCasePipe } from './sentence-case/sentence-case.pipe';

@NgModule({
  declarations: [SentenceCasePipe, FormatForIdPipe],
  exports: [SentenceCasePipe, FormatForIdPipe],
  providers: [SentenceCasePipe],
})
export class PipesModule {}
