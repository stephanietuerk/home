import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { ArtHistoryJobsModule } from './art-history-jobs/art-history-jobs.module';
import { BeyondBarComponent } from './beyond/beyond-bar/beyond-bar.component';
import { BeyondMapComponent } from './beyond/beyond-map/beyond-map.component';
import { BeyondComponent } from './beyond/beyond.component';
import { FlipComponent } from './flip/flip.component';
import { ProjectComponent } from './project.component';
import { ProjectsRoutingModule } from './projects-routing.module';

@NgModule({
    declarations: [ProjectComponent, FlipComponent, BeyondComponent, BeyondMapComponent, BeyondBarComponent],
    providers: [],
    imports: [CommonModule, ProjectsRoutingModule, SharedModule, ArtHistoryJobsModule],
})
export class ProjectsModule {}
