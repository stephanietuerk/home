import { AfterViewInit, Directive, inject, Renderer2 } from '@angular/core';

export type UnlistenFunction = () => void;
export type ListenElement = HTMLElement | SVGElement;

@Directive()
export abstract class EventDirective implements AfterViewInit {
  elements: ListenElement[];
  preventEffect = false;

  protected renderer = inject(Renderer2);

  abstract setListeners(): void;
  abstract setListenedElements(): void;

  ngAfterViewInit(): void {
    this.setListenedElements();
  }
}
