import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  Input,
  OnInit,
  ViewChild,
} from '@angular/core';

@Component({
  selector: 'app-mobile-warning',
  imports: [CommonModule],
  templateUrl: './mobile-warning.component.html',
  styleUrl: './mobile-warning.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MobileWarningComponent implements OnInit, AfterViewInit {
  @ViewChild('container') container: ElementRef;
  @Input() fadeout = true;
  @Input() warningWidth = 700;
  @Input() messageText: string[] = [
    'Hi there, person on a narrow-width screen!',
    'This project was built some time ago, and is not optimized for smaller browser widths.',
    'Please view on a larger screen for the intended experience.',
  ];
  display = false;

  ngOnInit(): void {
    if (window.innerWidth < this.warningWidth) {
      this.display = true;
    }
  }

  ngAfterViewInit(): void {
    if (this.display && this.fadeout) {
      // Show only if on narrow screen
      if (this.container.nativeElement) {
        setTimeout(() => {
          this.container.nativeElement.classList.add('fade-out');
        }, 5000);
      }
    }
  }
}
