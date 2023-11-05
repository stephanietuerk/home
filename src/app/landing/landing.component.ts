import { Component, OnInit } from '@angular/core';
import { PROJECTS } from '../core/constants/projects.constants';
import { SECTIONS } from '../core/constants/sections.constants';
import { Project } from '../core/models/project.model';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.scss'],
})
export class LandingComponent implements OnInit {
  projects: Project[];
  sections: any;

  ngOnInit() {
    this.projects = PROJECTS;
    this.sections = SECTIONS;
  }
}
