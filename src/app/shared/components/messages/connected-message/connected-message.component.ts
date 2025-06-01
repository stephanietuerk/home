import { A11yModule } from '@angular/cdk/a11y';
import { NgFor, NgIf } from '@angular/common';
import { Component, Input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { CloseButtonComponent } from '../../close-button/close-button.component';
import { Message } from '../message/message.directive';

@Component({
  selector: 'app-connected-message',
  imports: [MatIconModule, NgFor, A11yModule, NgIf, CloseButtonComponent],
  templateUrl: './connected-message.component.html',
  styleUrls: ['./connected-message.component.scss'],
  host: {
    '[style.minWidth]': 'minWidth',
    class: 'connected-message-component',
  },
})
export class ConnectedMessageComponent extends Message {
  @Input() minWidth = '360px';
}
