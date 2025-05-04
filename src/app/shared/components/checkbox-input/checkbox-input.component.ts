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
  selector: 'app-checkbox-input',
  standalone: true,
  imports: [CommonModule, FormatForIdPipe, SvgIconComponent],
  templateUrl: './checkbox-input.component.html',
  styleUrls: ['./checkbox-input.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class CheckboxInputComponent implements OnInit {
  private _uniqueId = `st-${++nextUniqueId}`;
  @Input() id: string;
  @Input() option: InputOption;
  @Input() group;
  @Input() isStyledCheckbox: boolean;

  @Output() selection = new EventEmitter();
  uniqueId: string;

  ngOnInit(): void {
    this.getId();
  }

  getId(): void {
    this.uniqueId = `${this.id || this._uniqueId}-checkbox-input`;
  }

  onClick(): void {
    this.option.selected = !this.option.selected;
    this.selection.emit();
  }

  getIconName(): string {
    return this.isStyledCheckbox && this.option.selected
      ? 'checkbox-selected'
      : 'checkbox-unselected';
  }
}
