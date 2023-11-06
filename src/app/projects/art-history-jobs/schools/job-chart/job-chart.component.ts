import { Component, HostListener, Input } from '@angular/core';
import { JobsBySchoolDatum } from '../../art-history-data.model';
import { ArtHistoryFieldsService } from '../../art-history-fields.service';

@Component({
  selector: 'app-job-chart',
  templateUrl: './job-chart.component.html',
  styleUrls: ['./job-chart.component.scss'],
})
export class JobChartComponent {
  @Input() job: JobsBySchoolDatum;
  @Input() year: string;
  @Input() isFirstColumn: boolean;

  @HostListener('mouseenter', ['$event'])
  onMouseEnter(event: MouseEvent): void {
    console.log(this.job.field, this.year);
  }

  constructor(public fieldsService: ArtHistoryFieldsService) {}
}
