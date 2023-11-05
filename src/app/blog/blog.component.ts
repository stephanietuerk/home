import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Project } from '../core/models/project.model';
import { getProjectFromURL } from '../core/utilities/route.utils';

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
    this.project = getProjectFromURL(this.router.url);
  }

  getDate(date: Date) {
    const options = { dateStyle: 'long' } as any;
    return new Intl.DateTimeFormat('en-US', options).format(date);
  }
}
