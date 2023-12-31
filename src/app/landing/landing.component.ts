import { Component } from '@angular/core';
import { PROJECTS } from '../core/constants/projects.constants';
import { SECTIONS } from '../core/constants/sections.constants';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.scss'],
})
export class LandingComponent {
  projects = PROJECTS;
  sections = SECTIONS;
}
