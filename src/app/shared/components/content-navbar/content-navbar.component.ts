import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-content-navbar',
  templateUrl: './content-navbar.component.html',
  styleUrls: ['./content-navbar.component.scss'],
})
export class ContentNavbarComponent {
  @Input() title: string;
}
