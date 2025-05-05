import { A11yModule } from '@angular/cdk/a11y';
import { NgFor, NgIf } from '@angular/common';
import { Component, Input, ViewEncapsulation } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { CloseButtonComponent } from '../../close-button/close-button.component';
import { Message } from '../message/message.directive';

@Component({
    selector: 'app-global-message',
    imports: [MatIconModule, NgFor, A11yModule, NgIf, CloseButtonComponent],
    templateUrl: './global-message.component.html',
    styleUrls: ['./global-message.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class GlobalMessageComponent extends Message {
  /**
   * The title block of the message.
   */
  @Input() title: string;
}
