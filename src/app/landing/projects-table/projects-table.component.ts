import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { animations } from 'src/app/core/constants/animations.constants';
import { Project } from 'src/app/core/models/project.model';
import { PROJECTS } from '../../core/constants/projects.constants';

@Component({
    selector: 'app-projects-table',
    templateUrl: './projects-table.component.html',
    styleUrls: ['./projects-table.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: [animations.slide('project-overview-component')],
})
export class ProjectsTableComponent implements OnInit {
    sections: any;
    projects: Project[];
    state: { [index: string]: boolean };

    constructor() {}

    ngOnInit(): void {
        this.projects = PROJECTS;
        this.initializeState();
    }

    initializeState(): void {
        this.state = this.projects.reduce((state, project) => {
            state[project.id] = false;
            return state;
        }, {});
    }

    getCellText(text): string {
        return Array.isArray(text) ? text.join(', ') : text;
    }

    toggleDescription(projectId): void {
        this.state[projectId] = !this.state[projectId];
    }

    getIcon(projectId): string {
        return this.state[projectId] ? 'row-arrow-up' : 'row-arrow-down';
    }
}
