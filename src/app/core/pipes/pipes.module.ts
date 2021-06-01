import { FormatForIdPipe } from './formatForId/formatForId.pipe';
import { NgModule } from '@angular/core';
import { SafePipe } from './safeHtml/safe.pipe';

@NgModule({
    declarations: [FormatForIdPipe, SafePipe],
    exports: [FormatForIdPipe, SafePipe]
})
export class PipesModule {}
