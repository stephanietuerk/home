import { NgModule } from '@angular/core';
import { FormatForIdPipe } from './formatForId/formatForId.pipe';
import { SafePipe } from './safeHtml/safe.pipe';

@NgModule({
  declarations: [FormatForIdPipe, SafePipe],
  exports: [FormatForIdPipe, SafePipe],
})
export class PipesModule {}
