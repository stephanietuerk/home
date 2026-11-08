import { FocusMonitor } from '@angular/cdk/a11y';
import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  Input,
  OnDestroy,
  QueryList,
  ViewChildren,
} from '@angular/core';
import { ExploreDataService } from '../../explore-data.service';

@Component({
  selector: 'app-change-chart-toggle',
  imports: [CommonModule],
  templateUrl: './change-chart-toggle.component.html',
  styleUrls: ['./change-chart-toggle.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChangeChartToggleComponent implements AfterViewInit, OnDestroy {
  @Input() currentValue: boolean;
  @Input() startYear: number;
  @Input() endYear: number;
  @ViewChildren('hiddenInput') hiddenInputs: QueryList<
    ElementRef<HTMLInputElement>
  >;
  constructor(
    private focusMonitor: FocusMonitor,
    private exploreDataService: ExploreDataService
  ) {}

  ngAfterViewInit(): void {
    this.hiddenInputs.forEach((input) => {
      this.focusMonitor.monitor(input);
    });
  }

  ngOnDestroy(): void {
    this.hiddenInputs.forEach((input) => {
      this.focusMonitor.stopMonitoring(input);
    });
  }

  toggleChangeIsAverage(button: 'avg' | 'year'): void {
    const changeIsAverage = button === 'avg' ? true : false;
    if (changeIsAverage !== this.currentValue) {
      this.exploreDataService.updateSelections({
        changeIsAverage,
      });
    }
  }
}
