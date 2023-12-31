import { AfterViewInit, Directive } from '@angular/core';

@Directive()
export abstract class Message implements AfterViewInit {
  message: string[];
  closeAfter: number;
  close: () => void;

  ngAfterViewInit(): void {
    if (this.closeAfter) {
      setTimeout(() => {
        this.close();
      }, this.closeAfter);
    }
  }

  onClose(): void {
    this.close();
  }
}
