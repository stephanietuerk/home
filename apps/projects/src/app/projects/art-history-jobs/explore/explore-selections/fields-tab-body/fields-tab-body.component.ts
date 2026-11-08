import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
} from '@angular/core';
import { JobProperty } from '../../../art-history-data.model';
import { ExploreDataService } from '../../explore-data.service';
import { fieldValueOptions } from '../explore-selections.constants';
import { FilterType } from '../explore-selections.model';
import { VariableSingleMultiSelectionComponent } from '../variable-single-multi-selection/variable-single-multi-selection.component';
import { VariableUseSelectionComponent } from '../variable-use-selection/variable-use-selection.component';

@Component({
  selector: 'app-fields-tab-body',
  imports: [
    CommonModule,
    VariableUseSelectionComponent,
    VariableSingleMultiSelectionComponent,
  ],
  templateUrl: './fields-tab-body.component.html',
  styleUrls: ['../tabs-body.scss', './fields-tab-body.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class FieldsTabBodyComponent {
  JobProperty = JobProperty;
  FilterType = FilterType;
  fieldValueOptions = fieldValueOptions;

  constructor(public dataService: ExploreDataService) {}
}
