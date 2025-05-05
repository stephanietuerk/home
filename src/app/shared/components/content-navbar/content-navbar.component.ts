import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
    selector: 'app-content-navbar',
    imports: [CommonModule, RouterModule],
    templateUrl: './content-navbar.component.html',
    styleUrls: ['./content-navbar.component.scss']
})
export class ContentNavbarComponent {
  @Input() title: string;
}
