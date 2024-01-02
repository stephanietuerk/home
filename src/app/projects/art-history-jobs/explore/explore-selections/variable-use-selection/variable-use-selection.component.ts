import { FocusMonitor } from '@angular/cdk/a11y';
import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  Input,
  OnChanges,
  OnDestroy,
  QueryList,
  SimpleChanges,
  ViewChildren,
} from '@angular/core';
import { CategoryLabelPipe } from '../../../art-history-fields.pipe';
import { EntityCategory } from '../../explore-data.model';
import { ExploreDataService } from '../../explore-data.service';
import { variableUseOptions } from '../explore-selections.constants';

@Component({
  selector: 'app-variable-use-selection',
  standalone: true,
  imports: [CommonModule, CategoryLabelPipe],
  templateUrl: './variable-use-selection.component.html',
  styleUrls: ['./variable-use-selection.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VariableUseSelectionComponent
  implements OnChanges, AfterViewInit, OnDestroy
{
  @Input() variable: EntityCategory;
  @ViewChildren('hiddenInput') hiddenInputs: QueryList<
    ElementRef<HTMLInputElement>
  >;
  selectionsVariable: string;
  variableUseOptions = variableUseOptions;

  constructor(
    public data: ExploreDataService,
    private focus: FocusMonitor
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['variable'] && this.variable) {
      this.selectionsVariable = `${this.variable}Use`;
    }
  }

  ngAfterViewInit(): void {
    this.hiddenInputs.forEach((input) => {
      console.log('input var use', input);
      this.focus.monitor(input);
    });
  }

  ngOnDestroy(): void {
    this.hiddenInputs.forEach((input) => {
      this.focus.stopMonitoring(input);
    });
  }

  updateVariableUse(variableUse: 'filter' | 'disaggregate'): void {
    this.data.updateSelections({
      [this.selectionsVariable]: variableUse,
    });
  }
}
