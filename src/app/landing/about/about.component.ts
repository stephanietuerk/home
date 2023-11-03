import { Component, OnInit } from '@angular/core';
import { SECTIONS } from '../../core/constants/sections.constants';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss'],
})
export class AboutComponent implements OnInit {
  sections: any;
  expanded = false;
  toggleText: string;

  ngOnInit() {
    this.sections = SECTIONS;
    this.setToggleText();
  }

  toggleMore() {
    this.expanded = !this.expanded;
    this.setToggleText();
  }

  setToggleText(): void {
    this.toggleText = this.expanded ? 'show less' : 'read more';
  }
}
