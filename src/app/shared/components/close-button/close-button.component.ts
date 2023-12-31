import { NgIf } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-close-button',
  templateUrl: './close-button.component.html',
  styleUrls: ['./close-button.component.scss'],
  imports: [NgIf],
  standalone: true,
})
export class CloseButtonComponent {
  @Output() closeEvent: EventEmitter<void> = new EventEmitter();
  @Input() ariaLabel = 'Close modal';
  @Input() isVisible = true;

  onClose() {
    this.closeEvent.emit();
  }
}
