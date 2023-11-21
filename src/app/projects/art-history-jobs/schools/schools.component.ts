import { Component, OnInit } from '@angular/core';
import { filter, takeUntil } from 'rxjs';
import { Unsubscribe } from 'src/app/shared/unsubscribe.directive';
import { JobsByCountry } from '../art-history-data.model';
import { ArtHistoryDataService } from '../art-history-data.service';

@Component({
  selector: 'app-schools',
  templateUrl: './schools.component.html',
  styleUrls: ['./schools.component.scss'],
})
export class SchoolsComponent extends Unsubscribe implements OnInit {
  dataBySchool: JobsByCountry[];
  yearRange: string[];

  constructor(public dataService: ArtHistoryDataService) {
    super();
  }

  ngOnInit(): void {
    this.setData();
  }

  setData(): void {
    this.dataService.dataBySchool$
      .pipe(
        takeUntil(this.unsubscribe),
        filter((x) => !!x)
      )
      .subscribe((data) => {
        this.dataBySchool = data;
        this.setYearRange();
      });
  }

  setYearRange(): void {
    this.yearRange = this.dataBySchool[0].jobsBySchool[0].jobsByYear.map(
      (x) => x.year
    );
  }
}
