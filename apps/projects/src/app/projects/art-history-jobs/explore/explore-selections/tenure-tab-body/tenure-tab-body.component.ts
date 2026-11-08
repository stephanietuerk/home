import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { JobProperty } from '../../../art-history-data.model';
import { ExploreDataService } from '../../explore-data.service';
import { tenureValueOptions } from '../explore-selections.constants';
import { FilterType } from '../explore-selections.model';
import { VariableSingleMultiSelectionComponent } from '../variable-single-multi-selection/variable-single-multi-selection.component';
import { VariableUseSelectionComponent } from '../variable-use-selection/variable-use-selection.component';

@Component({
  selector: 'app-tenure-tab-body',
  imports: [
    CommonModule,
    VariableSingleMultiSelectionComponent,
    VariableUseSelectionComponent,
  ],
  templateUrl: './tenure-tab-body.component.html',
  styleUrls: ['../tabs-body.scss', './tenure-tab-body.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TenureTabBodyComponent {
  JobProperty = JobProperty;
  FilterType = FilterType;
  tenureValueOptions = tenureValueOptions;

  constructor(public dataService: ExploreDataService) {}
}
