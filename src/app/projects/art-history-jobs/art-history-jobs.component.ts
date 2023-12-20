import { Component, OnInit } from '@angular/core';
import { ArtHistoryDataService } from './art-history-data.service';
import { ExploreDataService } from './explore/explore-data.service';

@Component({
  selector: 'app-art-history-jobs',
  templateUrl: './art-history-jobs.component.html',
  styleUrls: ['./art-history-jobs.component.scss'],
  providers: [ExploreDataService],
})
export class ArtHistoryJobsComponent implements OnInit {
  constructor(
    public mainDataService: ArtHistoryDataService,
    public exploreDataService: ExploreDataService
  ) {}

  ngOnInit(): void {
    this.mainDataService.init().then(() => {
      this.exploreDataService.init();
    });
  }
}
