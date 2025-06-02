import { NgIf } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { SvgIconComponent } from '../svg-icon/svg-icon.component';

@Component({
  selector: 'app-close-button',
  imports: [NgIf, SvgIconComponent],
  templateUrl: './close-button.component.html',
  styleUrls: ['./close-button.component.scss'],
})
export class CloseButtonComponent {
  @Output() closeEvent: EventEmitter<void> = new EventEmitter();
  @Input() ariaLabel = 'Close modal';
  @Input() isVisible = true;

  onClose() {
    this.closeEvent.emit();
  }
}
