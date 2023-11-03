import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-svg-icon',
  templateUrl: './svg-icon.component.html',
})
export class SvgIconComponent {
  @Input() name: string;

  constructor() {}

  get absUrl() {
    return window.location.href;
  }
}
