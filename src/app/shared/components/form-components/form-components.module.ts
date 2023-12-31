import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatNativeDateModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { SharedModule } from '../../shared.module';
import { FormCheckboxInputComponent } from './form-checkbox-input/form-checkbox-input.component';
import { FormRadioInputComponent } from './form-radio-input/form-radio-input.component';
import { FormSelectWithFilteringComponent } from './form-select-with-filtering/form-select-with-filtering.component';
import { FormSelectComponent } from './form-select/form-select.component';

@NgModule({
  imports: [
    ReactiveFormsModule,
    MatSelectModule,
    MatNativeDateModule,
    MatAutocompleteModule,
    CommonModule,
    SharedModule,
  ],
  declarations: [
    FormRadioInputComponent,
    FormSelectComponent,
    FormSelectWithFilteringComponent,
    FormCheckboxInputComponent,
  ],
  exports: [
    FormRadioInputComponent,
    FormSelectComponent,
    FormSelectWithFilteringComponent,
    FormCheckboxInputComponent,
  ],
})
export class FormComponentsModule {}
