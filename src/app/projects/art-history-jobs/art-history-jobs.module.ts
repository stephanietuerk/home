import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';
import { ArtHistoryJobsComponent } from './art-history-jobs.component';

@NgModule({
    declarations: [ArtHistoryJobsComponent],
    imports: [CommonModule, SharedModule],
    exports: [ArtHistoryJobsComponent],
})
export class ArtHistoryJobsModule {}
