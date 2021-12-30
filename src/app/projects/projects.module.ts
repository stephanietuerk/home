import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { ArtHistoryJobsModule } from './art-history-jobs/art-history-jobs.module';
import { BeyondModule } from './beyond/beyond.module';
import { FlipModule } from './flip/flip.module';
import { ProjectComponent } from './project.component';
import { ProjectsRoutingModule } from './projects-routing.module';

@NgModule({
    declarations: [ProjectComponent],
    providers: [],
    imports: [CommonModule, ProjectsRoutingModule, SharedModule, ArtHistoryJobsModule, BeyondModule, FlipModule],
})
export class ProjectsModule {}
