import { Component, OnInit } from '@angular/core';
import { ArtHistoryJobsService } from './art-history-jobs.service';

@Component({
    selector: 'app-art-history-jobs',
    templateUrl: './art-history-jobs.component.html',
    styleUrls: ['./art-history-jobs.component.scss'],
})
export class ArtHistoryJobsComponent implements OnInit {
    constructor(private service: ArtHistoryJobsService) {}

    ngOnInit(): void {}
}
