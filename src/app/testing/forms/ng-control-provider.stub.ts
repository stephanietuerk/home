/* eslint-disable @typescript-eslint/no-empty-function */
import { FormControl, NgControl } from '@angular/forms';

export const NG_CONTROL_PROVIDER = {
  provide: NgControl,
  useClass: class extends NgControl {
    control = new FormControl();
    viewToModelUpdate() {}
  },
};
