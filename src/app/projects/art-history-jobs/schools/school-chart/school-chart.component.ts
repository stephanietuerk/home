import { Component, Input, OnInit } from '@angular/core';
import { JobsBySchoolDatum, JobsByYear } from '../../art-history-data.model';

@Component({
  selector: 'app-school-chart',
  templateUrl: './school-chart.component.html',
  styleUrls: ['./school-chart.component.scss'],
})
export class SchoolChartComponent implements OnInit {
  @Input() jobsByYear: JobsByYear[];
  @Input() years: string[];
  @Input() isFirstColumn: boolean;

  ngOnInit(): void {
    // this.setYearRange();
    return;
  }

  getJobsForYear(year: string): JobsBySchoolDatum[] {
    const jobs = this.jobsByYear.find((x) => x.year === year).jobs;
    return jobs;
  }
}
