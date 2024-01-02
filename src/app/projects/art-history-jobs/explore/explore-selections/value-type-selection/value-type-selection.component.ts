import { FocusMonitor } from '@angular/cdk/a11y';
import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  OnDestroy,
  QueryList,
  ViewChildren,
} from '@angular/core';
import { ExploreDataService } from '../../explore-data.service';
import { valueTypeOptions } from '../explore-selections.constants';
import { ValueType } from '../explore-selections.model';

@Component({
  selector: 'app-value-type-selection',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './value-type-selection.component.html',
  styleUrls: ['./value-type-selection.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ValueTypeSelectionComponent implements AfterViewInit, OnDestroy {
  @ViewChildren('hiddenInput') hiddenInputs: QueryList<
    ElementRef<HTMLInputElement>
  >;
  valueTypeOptions = valueTypeOptions;

  constructor(
    public data: ExploreDataService,
    private focus: FocusMonitor
  ) {}

  ngAfterViewInit(): void {
    this.hiddenInputs.forEach((input) => {
      this.focus.monitor(input);
    });
  }

  ngOnDestroy(): void {
    this.hiddenInputs.forEach((input) => {
      this.focus.stopMonitoring(input);
    });
  }

  updateValueType(valueType: keyof typeof ValueType): void {
    this.data.updateSelections({ valueType: valueType });
  }
}
