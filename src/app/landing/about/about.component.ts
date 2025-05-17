import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { SECTIONS } from '../../core/constants/sections.constants';
import { ExpandArrowComponent } from '../../shared/components/expand-arrow/expand-arrow.component';

@Component({
  selector: 'app-about',
  imports: [CommonModule, ExpandArrowComponent],
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class AboutComponent implements OnInit {
  sections: any;
  expanded = false;
  toggleText: string;
  hovered = false;

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

  getIcon(): string {
    return this.expanded ? 'row-arrow-up' : 'row-arrow-down';
  }
}
