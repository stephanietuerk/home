import { Component } from '@angular/core';
import { ArtHistoryDataService } from '../art-history-data.service';

@Component({
  selector: 'app-schools',
  templateUrl: './schools.component.html',
  styleUrls: ['./schools.component.scss'],
})
export class SchoolsComponent {
  constructor(public dataService: ArtHistoryDataService) {}
}
