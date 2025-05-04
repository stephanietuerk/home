import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { lastScrapeDate } from '../art-history-jobs.constants';

@Component({
  selector: 'app-data-acquisition',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './data-acquisition.component.html',
  styleUrls: ['./data-acquisition.component.scss'],
})
export class DataAcquisitionComponent {
  lastScrapeDate = lastScrapeDate;
}
