import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { SchoolsDataService } from './schools-data.service';

@Component({
  selector: 'app-schools',
  templateUrl: './schools.component.html',
  styleUrls: ['./schools.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class SchoolsComponent implements OnInit {
  panelIsOpen: boolean[] = [true];
  constructor(public dataService: SchoolsDataService) {}

  ngOnInit(): void {
    this.dataService.init();
  }
}
