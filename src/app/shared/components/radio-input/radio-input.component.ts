import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewEncapsulation,
} from '@angular/core';
import { FormatForIdPipe } from '../../pipes/format-for-id/format-for-id.pipe';
import { InputOption } from '../input-option.model';
import { SvgIconComponent } from '../svg-icon/svg-icon.component';

let nextUniqueId = 0;

@Component({
    selector: 'app-radio-input',
    imports: [CommonModule, SvgIconComponent, FormatForIdPipe],
    templateUrl: './radio-input.component.html',
    styleUrls: ['./radio-input.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class RadioInputComponent implements OnInit {
  private _uniqueId = `${++nextUniqueId}`;
  @Input() id: string;
  @Input() option: InputOption;
  @Input() group;
  @Input() isStyledRadio: boolean;

  @Output() selection = new EventEmitter();
  uniqueId: string;

  ngOnInit(): void {
    this.getId();
  }

  getId(): void {
    this.uniqueId = `smt-radio-input-${this.id || this._uniqueId}`;
  }

  onClick(): void {
    if (!this.option.selected) {
      this.selection.emit();
    }
  }

  getIconName(): string {
    return this.isStyledRadio && this.option.selected
      ? 'radio-selected'
      : 'radio-unselected';
  }
}
