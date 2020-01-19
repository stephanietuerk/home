import { RoutingModule } from './routing.module';
import { SvgIconComponent } from './core/svg-icon/svg-icon.component';
import { SvgDefinitionsComponent } from './core/svg-icon/svg-definitions.component';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { PortalModule } from '@angular/cdk/portal';
import { AppComponent } from './app.component';
import { NavbarComponent } from './landing/navbar/navbar.component';
import { AboutComponent } from './landing/about/about.component';
import { LandingPageComponent } from './landing/landing-page.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ProjectListComponent } from './landing/project-list/project-list.component';
import { ContentComponent } from './landing/content/content.component';
import { ProjectsPageComponent } from './projects/projects-page.component';

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    AboutComponent,
    LandingPageComponent,
    ProjectListComponent,
    ContentComponent,
    SvgDefinitionsComponent,
    SvgIconComponent,
    ProjectsPageComponent
  ],
  imports: [
    BrowserModule,
    RoutingModule,
    BrowserAnimationsModule,
    PortalModule
  ],
  providers: [],
  bootstrap: [AppComponent],
  entryComponents: [AboutComponent, ProjectListComponent]
})
export class AppModule {}
