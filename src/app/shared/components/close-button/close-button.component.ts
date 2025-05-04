import { NgIf } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-close-button',
  standalone: true,
  imports: [NgIf],
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
