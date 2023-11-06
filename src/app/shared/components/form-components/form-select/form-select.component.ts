import {
  Component,
  Input,
  Optional,
  Self,
  ViewEncapsulation,
} from '@angular/core';
import {
  ControlContainer,
  FormGroupDirective,
  NgControl,
} from '@angular/forms';
import { NOOP_VALUE_ACCESSOR } from '../forms.constants';

@Component({
  selector: 'app-select',
  templateUrl: './form-select.component.html',
  styleUrls: ['./form-select.component.scss'],
  encapsulation: ViewEncapsulation.None,
  viewProviders: [
    {
      provide: ControlContainer,
      useExisting: FormGroupDirective,
    },
  ],
})
export class FormSelectComponent {
  @Input() formControlName: string;
  @Input() options: string[];
  @Input() placeholder?;
  @Input() textAlign?:
    | 'start'
    | 'end'
    | 'left'
    | 'right'
    | 'center'
    | 'justify'
    | 'match-parent';
  @Input() overlayClass?: string;

  constructor(@Self() @Optional() public ngControl: NgControl) {
    this.ngControl.valueAccessor = NOOP_VALUE_ACCESSOR;
  }
}
