import { Platform } from '@angular/cdk/platform';
import { DOCUMENT } from '@angular/common';
import {
  AfterViewInit,
  Component,
  ContentChild,
  ElementRef,
  Inject,
  NgZone,
  OnInit,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { filter, fromEvent, merge, takeUntil } from 'rxjs';
import { Unsubscribe } from '../../unsubscribe.directive';
import { ComboboxLabelComponent } from './combobox-label/combobox-label.component';
import { ComboboxService } from './combobox.service';

@Component({
    selector: 'app-combobox',
    templateUrl: './combobox.component.html',
    styleUrls: ['./combobox.component.scss'],
    providers: [ComboboxService],
    encapsulation: ViewEncapsulation.None,
    standalone: false
})
export class ComboboxComponent
  extends Unsubscribe
  implements OnInit, AfterViewInit
{
  @ViewChild('comboboxComponent') comboboxElRef: ElementRef;
  @ContentChild(ComboboxLabelComponent) labelComponent: ComboboxLabelComponent;

  constructor(
    public service: ComboboxService,
    public platform: Platform,
    private zone: NgZone,
    @Inject(DOCUMENT) private document: Document,
    private elRef: ElementRef
  ) {
    super();
  }

  ngOnInit(): void {
    this.handleOutsideClick();
  }

  ngAfterViewInit(): void {
    this.service.setComboboxElRef(this.comboboxElRef);
  }

  handleOutsideClick(): void {
    if (!this.document) {
      return;
    }

    this.zone.runOutsideAngular(() => {
      merge(
        fromEvent(this.document, 'touchstart', { capture: true }),
        fromEvent(this.document, 'mousedown', { capture: true })
      )
        .pipe(
          takeUntil(this.unsubscribe),
          filter(
            (event) => !event.composedPath().includes(this.elRef.nativeElement)
          )
        )
        .subscribe(() => {
          this.service.emitBlurEvent();
        });
    });
  }
}
