import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Project } from '../core/models/project.model';
import { getProjectFromURL } from '../core/utilities/route.utils';

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
        this.project = getProjectFromURL(this.router.url);
    }
}
