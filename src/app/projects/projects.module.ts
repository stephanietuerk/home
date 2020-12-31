import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProjectNavbarComponent } from './projects-navbar/project-navbar.component';
import { ProjectComponent } from './project.component';
import { ProjectsRoutingModule } from './projects-routing.module';
import { FlipComponent } from './flip/flip.component';
import { FlipResource } from './flip/resources/flip.resource';
import { FlipService } from './flip/services/flip.service';
import { FlipBar } from './flip/flip-bar.class';

@NgModule({
  declarations: [
    ProjectNavbarComponent,
    ProjectComponent,
    FlipComponent
  ],
  providers: [
    FlipResource,
    FlipService
  ],
  imports: [
    CommonModule, ProjectsRoutingModule
  ]
})
export class ProjectsModule { }
