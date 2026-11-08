import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { SvgIconComponent } from '../../../shared/components/svg-icon/svg-icon.component';
import { lastScrapeDate } from '../art-history-jobs.constants';

@Component({
  selector: 'app-data-acquisition',
  imports: [CommonModule, SvgIconComponent],
  templateUrl: './data-acquisition.component.html',
  styleUrls: ['./data-acquisition.component.scss'],
})
export class DataAcquisitionComponent {
  lastScrapeDate = lastScrapeDate;
}
