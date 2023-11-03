import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[hoverClassOnSiblings]',
})
export class HoverClassOnSiblingsDirective {
  nonHoverClass: string = 'not-hovered';
  hoverClass: string = 'hovered';

  constructor(public el: ElementRef) {}

  @HostListener('mouseenter') onMouseEnter() {
    const children = this.getParentsChildren();
    Array.from(children).forEach((node: HTMLElement) => {
      if (node !== this.el.nativeElement) {
        node.classList.add(this.nonHoverClass);
      }
    });
    this.el.nativeElement.classList.add(this.hoverClass);
  }

  @HostListener('mouseleave') onMouseLeave() {
    const children = this.getParentsChildren();
    Array.from(children).forEach((node) => {
      if (node !== this.el.nativeElement) {
        node.classList.remove(this.nonHoverClass);
      }
    });
    this.el.nativeElement.classList.remove(this.hoverClass);
  }

  getParentsChildren(): HTMLCollection {
    return this.el.nativeElement.parentNode.children;
  }
}
