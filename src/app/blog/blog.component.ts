import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PROJECTS } from '../core/constants/projects.constants';
import { Project } from '../core/models/project.model';

@Component({
    selector: 'app-blog',
    templateUrl: './blog.component.html',
    styleUrls: ['./blog.component.scss'],
})
export class BlogComponent implements OnInit {
    project: Project;

    constructor(private router: Router) {}

    ngOnInit() {
        this.setProject();
    }

    setProject() {
        this.project = PROJECTS.find((x) => x.routerLink === this.router.url);
    }
}
