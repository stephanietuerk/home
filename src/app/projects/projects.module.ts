import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProjectNavbarComponent } from './projects-navbar/project-navbar.component';
import { ProjectComponent } from './project.component';
import { ProjectsRoutingModule } from './projects-routing.module';
import { FlipComponent } from './flip/flip.component';
import { FlipResource } from './flip/resources/flip.resource';
import { FlipService } from './flip/services/flip.service';
import { BeyondComponent } from './beyond/beyond.component';
import { BeyondService } from './beyond/services/beyond.service';
import { BeyondResource } from './beyond/resources/beyond.resource';
import { LeavingComponent } from './leaving/leaving.component';
import { BeyondMapComponent } from './beyond/beyond-map/beyond-map.component';

@NgModule({
    declarations: [ProjectNavbarComponent, ProjectComponent, FlipComponent, BeyondComponent, LeavingComponent, BeyondMapComponent],
    providers: [],
    imports: [CommonModule, ProjectsRoutingModule],
})
export class ProjectsModule {}
