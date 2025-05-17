import { A11yModule } from '@angular/cdk/a11y';
import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  Input,
  OnDestroy,
  TemplateRef,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { BehaviorSubject, Subscription } from 'rxjs';
import { animations } from 'src/app/core/constants/animations.constants';
import { OverlayService } from 'src/app/shared/components/overlay/overlay.service';
import { Unsubscribe } from 'src/app/shared/unsubscribe.directive';
import { JobProperty } from '../../art-history-data.model';
import { ExploreDataService } from '../explore-data.service';
import {
  fieldValueOptions,
  rankValueOptions,
  tenureValueOptions,
  variableUseOptions,
} from './explore-selections.constants';
import { FilterType } from './explore-selections.model';
import { ValueTypeSelectionComponent } from './value-type-selection/value-type-selection.component';
import { VariableSingleMultiSelectionComponent } from './variable-single-multi-selection/variable-single-multi-selection.component';
import { VariableUseSelectionComponent } from './variable-use-selection/variable-use-selection.component';
import { YearsSelectionComponent } from './years-selection/years-selection.component';

interface DropdownContent {
  isOpen: boolean;
  content: keyof typeof ExploreSelection | null;
}

export enum ExploreSelection {
  fields = 'fields',
  dataType = 'dataType',
  timeRange = 'timeRange',
  tenure = 'tenure',
  rank = 'rank',
}

@Component({
  selector: 'app-explore-selections',
  imports: [
    CommonModule,
    A11yModule,
    VariableUseSelectionComponent,
    VariableSingleMultiSelectionComponent,
    ValueTypeSelectionComponent,
    YearsSelectionComponent,
  ],
  templateUrl: './explore-selections.component.html',
  styleUrls: ['./explore-selections.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [animations.slide('selection-interface-container')],
  providers: [OverlayService],
})
export class ExploreSelectionsComponent
  extends Unsubscribe
  implements OnDestroy
{
  @Input() yearsRange: [number, number];
  @ViewChild('fieldsDd') fieldsDropdown: TemplateRef<HTMLDivElement>;
  @ViewChild('dataTypeDd') dataTypeDropdown: TemplateRef<HTMLDivElement>;
  @ViewChild('timeRangeDd') timeRangeDropdown: TemplateRef<HTMLDivElement>;
  @ViewChild('tenureDd') tenureDropdown: TemplateRef<HTMLDivElement>;
  @ViewChild('rankDd') rankDropdown: TemplateRef<HTMLDivElement>;
  @ViewChild('ddOrigin') dropdownOrigin: ElementRef<HTMLButtonElement>;
  filterUseOptions = variableUseOptions;
  fieldValueOptions = fieldValueOptions;
  tenureValueOptions = tenureValueOptions;
  rankValueOptions = rankValueOptions;
  dropdownContent: BehaviorSubject<DropdownContent> =
    new BehaviorSubject<DropdownContent>({
      isOpen: false,
      content: null,
    });
  dropdownContent$ = this.dropdownContent.asObservable();
  backdropClickSubscription: Subscription;
  JobProperty = JobProperty;
  FilterType = FilterType;

  constructor(public dataService: ExploreDataService) {
    super();
  }

  toggleOpenContent(
    selected: 'fields' | 'dataType' | 'timeRange' | 'tenure' | 'rank' | null
  ): void {
    if (
      selected === null ||
      this.dropdownContent.getValue().content === selected
    ) {
      this.resetDropdownContent();
    } else {
      this.dropdownContent.next({
        isOpen: true,
        content: selected,
      });
    }
  }

  closeDropdown(event: MouseEvent): void {
    if (
      !(event.target as HTMLElement).parentElement.classList.contains(
        'links-container'
      )
    ) {
      this.resetDropdownContent();
    }
  }

  resetDropdownContent(): void {
    this.dropdownContent.next({
      isOpen: false,
      content: null,
    });
  }
}
