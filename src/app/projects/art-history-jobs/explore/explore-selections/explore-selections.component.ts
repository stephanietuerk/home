import { A11yModule } from '@angular/cdk/a11y';
import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  signal,
  ViewEncapsulation,
} from '@angular/core';
import { animations } from 'src/app/core/constants/animations.constants';
import { OverlayService } from 'src/app/shared/components/overlay/overlay.service';
import { TabBodyComponent } from '../../../../shared/components/tabs/tab-body.component';
import { TabItemComponent } from '../../../../shared/components/tabs/tab-item.component';
import { TabLabelComponent } from '../../../../shared/components/tabs/tab-label.component';
import { TabsComponent } from '../../../../shared/components/tabs/tabs.component';
import { ExploreDataService } from '../explore-data.service';
import {
  ExploreSelection,
  exploreSelections,
} from './explore-selections.constants';
import { FieldsTabBodyComponent } from './fields-tab-body/fields-tab-body.component';
import { RankTabBodyComponent } from './rank-tab-body/rank-tab-body.component';
import { TenureTabBodyComponent } from './tenure-tab-body/tenure-tab-body.component';
import { TimeRangeTabBodyComponent } from './time-range-tab-body/time-range-tab-body.component';
import { ValueTypeTabBodyComponent } from './value-type-tab-body/value-type-tab-body.component';

interface DropdownContent {
  isOpen: boolean;
  content: keyof typeof ExploreSelection | null;
}

@Component({
  selector: 'app-explore-selections',
  imports: [
    CommonModule,
    A11yModule,
    TabsComponent,
    TabItemComponent,
    TabLabelComponent,
    TabBodyComponent,
    FieldsTabBodyComponent,
    TenureTabBodyComponent,
    RankTabBodyComponent,
    ValueTypeTabBodyComponent,
    TimeRangeTabBodyComponent,
  ],
  templateUrl: './explore-selections.component.html',
  styleUrls: ['./explore-selections.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [animations.slide('selection-interface-container')],
  providers: [OverlayService],
})
export class ExploreSelectionsComponent {
  exploreSelections = exploreSelections;
  displayedTab = signal<ExploreSelection>(ExploreSelection.fields);

  constructor(public dataService: ExploreDataService) {}

  handleTabChange(value: ExploreSelection): void {
    this.displayedTab.set(value);
  }
}
