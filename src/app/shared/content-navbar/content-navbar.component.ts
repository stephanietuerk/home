import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-content-navbar',
  templateUrl: './content-navbar.component.html',
  styleUrls: ['./content-navbar.component.scss'],
})
export class ContentNavbarComponent implements OnInit {
  @Input() title: string;

  constructor() {}

  ngOnInit() {}
}
