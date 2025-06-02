import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { JobProperty } from '../../../art-history-data.model';
import { ExploreDataService } from '../../explore-data.service';
import { rankValueOptions } from '../explore-selections.constants';
import { FilterType } from '../explore-selections.model';
import { VariableSingleMultiSelectionComponent } from '../variable-single-multi-selection/variable-single-multi-selection.component';
import { VariableUseSelectionComponent } from '../variable-use-selection/variable-use-selection.component';

@Component({
  selector: 'app-rank-tab-body',
  imports: [
    CommonModule,
    VariableSingleMultiSelectionComponent,
    VariableUseSelectionComponent,
  ],
  templateUrl: './rank-tab-body.component.html',
  styleUrls: ['../tabs-body.scss', './rank-tab-body.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RankTabBodyComponent {
  JobProperty = JobProperty;
  FilterType = FilterType;
  rankValueOptions = rankValueOptions;

  constructor(public dataService: ExploreDataService) {}
}
