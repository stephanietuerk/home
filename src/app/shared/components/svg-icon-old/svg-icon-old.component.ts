import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-svg-icon-old',
  imports: [],
  templateUrl: './svg-icon-old.component.html',
})
export class SvgIconOldComponent {
  @Input() name: string;

  get absUrl() {
    return window.location.href;
  }
}
