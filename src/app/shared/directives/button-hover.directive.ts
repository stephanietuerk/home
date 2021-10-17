import { Directive, ElementRef, HostListener } from '@angular/core';
import { highlightLight } from 'src/app/core/constants/colors.constants';

@Directive({
    selector: '[appButtonHover]',
})
export class ButtonHoverDirective {
    constructor(private el: ElementRef) {}

    @HostListener('mouseenter') onMouseEnter() {
        this.el.nativeElement.style.transition = 'all 0.2s ease-in-out';
        this.el.nativeElement.style.backgroundColor = highlightLight;
    }

    @HostListener('mouseleave') onMouseLeave() {
        this.el.nativeElement.style.backgroundColor = 'initial';
    }
}
