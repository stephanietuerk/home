import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import {
  SchoolStateProperty,
  SchoolsDataService,
} from '../schools-data.service';

@Component({
  selector: 'app-school-filters',
  templateUrl: './school-filters.component.html',
  styleUrls: ['./school-filters.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class SchoolFiltersComponent implements OnInit {
  SchoolStateProperty = SchoolStateProperty;

  constructor(public data: SchoolsDataService) {}

  ngOnInit(): void {
    this.data.init();
  }
}
