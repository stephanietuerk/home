import { OverlayModule } from '@angular/cdk/overlay';
import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { VicHtmlTooltipConfigBuilder } from '../../../../shared/components/viz/tooltips/html-tooltip/config/html-tooltip-builder';
import { VicHtmlTooltipModule } from '../../../../shared/components/viz/tooltips/html-tooltip/html-tooltip.module';
import { JobsBySchoolDatum } from '../../art-history-data.model';
import { ColorForFieldPipe } from '../../art-history-fields.pipe';
import { ArtHistoryFieldsService } from '../../art-history-fields.service';

@Component({
  selector: 'app-job-chart',
  imports: [
    CommonModule,
    VicHtmlTooltipModule,
    ColorForFieldPipe,
    OverlayModule,
  ],
  providers: [VicHtmlTooltipConfigBuilder],
  templateUrl: './job-chart.component.html',
  styleUrls: ['./job-chart.component.scss'],
})
export class JobChartComponent {
  @Input() job: JobsBySchoolDatum;
  @Input() year: string;
  @Input() isFirstColumn: boolean;
  showTooltip: boolean = false;

  constructor(public fieldsService: ArtHistoryFieldsService) {}
}
