import { OverlayModule, OverlayRef } from '@angular/cdk/overlay';
import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { MatExpansionModule } from '@angular/material/expansion';
import { take } from 'rxjs';
import { SvgIconComponent } from '../../../shared/components/svg-icon/svg-icon.component';
import { SubstringHighlightDirective } from '../../../shared/directives/substring-highlight.directive';
import { ColorForFieldPipe } from '../art-history-fields.pipe';
import { SchoolChartComponent } from './school-chart/school-chart.component';
import { SchoolFiltersComponent } from './school-filters/school-filters.component';
import { SchoolsDataService } from './schools-data.service';

@Component({
  selector: 'app-schools',
  imports: [
    CommonModule,
    SchoolFiltersComponent,
    MatExpansionModule,
    SchoolChartComponent,
    SubstringHighlightDirective,
    ColorForFieldPipe,
    OverlayModule,
    SvgIconComponent,
  ],
  templateUrl: './schools.component.html',
  styleUrls: ['./schools.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class SchoolsComponent implements OnInit {
  panelIsOpen: boolean[] = [true];
  numYears: number;
  overlayRef: OverlayRef;
  constructor(public dataService: SchoolsDataService) {}

  ngOnInit(): void {
    this.dataService.dataBySchool$.pipe(take(1)).subscribe(() => {
      this.numYears = this.dataService.yearRange.length;
    });
  }
}
