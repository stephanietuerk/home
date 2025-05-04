import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { Project } from '../core/models/project.model';
import { getProjectFromURL } from '../core/utilities/route.utils';
import { ContentNavbarComponent } from '../shared/components/content-navbar/content-navbar.component';

@Component({
  selector: 'app-blog',
  standalone: true,
  imports: [CommonModule, RouterModule, ContentNavbarComponent],
  templateUrl: './blog.component.html',
  styleUrls: ['./blog.component.scss'],
})
export class BlogComponent implements OnInit {
  project: Project;

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.setProject();
  }

  setProject(): void {
    this.project = getProjectFromURL(this.router.url);
  }

  getDate(date: Date): string {
    const options = { dateStyle: 'long' } as any;
    return new Intl.DateTimeFormat('en-US', options).format(date);
  }
}
