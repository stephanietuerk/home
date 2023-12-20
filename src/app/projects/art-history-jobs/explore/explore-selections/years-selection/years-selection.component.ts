import {
  Component,
  ElementRef,
  OnInit,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { ControlContainer, FormGroupDirective } from '@angular/forms';
import { format } from 'd3';
import noUiSlider from 'nouislider';
import { ArtHistoryDataService } from '../../../art-history-data.service';
import { ExploreDataService } from '../../explore-data.service';

export interface YearsSelection {
  start: number;
  end: number;
}

@Component({
  selector: 'app-years-selection',
  templateUrl: './years-selection.component.html',
  styleUrls: [
    '../../../styles/art-history-jobs.scss',
    './years-selection.component.scss',
  ],
  encapsulation: ViewEncapsulation.None,
  viewProviders: [
    {
      provide: ControlContainer,
      useExisting: FormGroupDirective,
    },
  ],
})
export class YearsSelectionComponent implements OnInit {
  @ViewChild('slider', { static: true }) slider: ElementRef;

  constructor(
    private selections: ExploreDataService,
    private data: ArtHistoryDataService
  ) {}

  ngOnInit(): void {
    this.createSlider();
    this.setSliderListener();
  }

  createSlider() {
    noUiSlider.create(this.slider.nativeElement, {
      start: [this.data.dataYears[0], this.data.dataYears[1]],
      connect: true,
      range: {
        min: this.data.dataYears[0],
        max: this.data.dataYears[1],
      },
      step: 1,
      margin: 1,
      tooltips: true,
      format: {
        to: (value: number) => format('.0f')(value),
        from: (value: string) => +value,
      },
      handleAttributes: [
        { 'aria-label': 'lower year handle' },
        { 'aria-label': 'upper year handle' },
      ],
      pips: {
        mode: 'steps' as any,
        density: 0,
        filter: (value: number, type: number) => {
          if ((value * 10) % 10 === 0) {
            return 2;
          } else {
            return -1;
          }
        },
      },
    });
    this.slider.nativeElement.classList.add('noUi-art-history');
  }

  setSliderListener(): void {
    this.slider.nativeElement.noUiSlider.on('set', (values: number[]) => {
      const selections: YearsSelection = {
        start: +values[0],
        end: +values[1],
      };
      this.selections.updateSelections({ years: selections });
    });
  }
}
