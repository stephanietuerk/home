import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PROJECTS } from '../core/constants/projects.constants';
import { Project } from '../core/models/project.model';

@Component({
    selector: 'app-project',
    templateUrl: './project.component.html',
    styleUrls: ['./project.component.scss'],
})
export class ProjectComponent implements OnInit {
    project: Project;

    constructor(private router: Router) {}

    ngOnInit() {
        this.setProject();
    }

    setProject() {
        this.project = PROJECTS.find((x) => x.routerLink === this.router.url);
    }
}
