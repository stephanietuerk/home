import { Component, OnInit } from '@angular/core';
import { ExploreDataService } from './explore/explore-data.service';

@Component({
  selector: 'app-art-history-jobs',
  templateUrl: './art-history-jobs.component.html',
  styleUrls: ['./art-history-jobs.component.scss'],
  providers: [ExploreDataService],
})
export class ArtHistoryJobsComponent implements OnInit {
  constructor(private dataService: ExploreDataService) {}

  ngOnInit(): void {
    this.dataService.init();
  }
}
