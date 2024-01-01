import { FocusMonitor } from '@angular/cdk/a11y';
import { AfterViewInit, Directive, ElementRef } from '@angular/core';

@Directive({
  selector: '[appFocusOnInit]',
  standalone: true,
})
export class FocusOnInitDirective implements AfterViewInit {
  constructor(
    private elementRef: ElementRef<HTMLElement>,
    private focusMonitor: FocusMonitor
  ) {}

  ngAfterViewInit(): void {
    this.focusMonitor.monitor(this.elementRef.nativeElement);
    this.elementRef.nativeElement.focus();
    this.focusMonitor.stopMonitoring(this.elementRef.nativeElement);
  }
}
