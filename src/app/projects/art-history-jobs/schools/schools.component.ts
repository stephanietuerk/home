import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { take } from 'rxjs';
import { SchoolsDataService } from './schools-data.service';

@Component({
  selector: 'app-schools',
  templateUrl: './schools.component.html',
  styleUrls: ['./schools.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class SchoolsComponent implements OnInit {
  panelIsOpen: boolean[] = [true];
  numYears: number;
  constructor(public dataService: SchoolsDataService) {}

  ngOnInit(): void {
    this.dataService.init();
    this.dataService.dataBySchool$.pipe(take(1)).subscribe((data) => {
      this.numYears = this.dataService.yearRange.length;
    });
  }
}
