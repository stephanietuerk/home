import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { JobsBySchoolDatum, JobsByYear } from '../../art-history-data.model';
import { JobIsInFiltersPipe } from '../../art-history-fields.pipe';
import { JobChartComponent } from '../job-chart/job-chart.component';
import { SchoolsDataService } from '../schools-data.service';

@Component({
  selector: 'app-school-chart',
  imports: [CommonModule, JobChartComponent, JobIsInFiltersPipe],
  templateUrl: './school-chart.component.html',
  styleUrls: ['./school-chart.component.scss'],
})
export class SchoolChartComponent {
  @Input() jobsByYear: JobsByYear[];
  @Input() years: string[];
  @Input() isFirstColumn: boolean;

  constructor(public data: SchoolsDataService) {}

  getJobsForYear(year: string): JobsBySchoolDatum[] {
    const jobs = this.jobsByYear.find((x) => x.year === year).jobs;
    return jobs;
  }
}
