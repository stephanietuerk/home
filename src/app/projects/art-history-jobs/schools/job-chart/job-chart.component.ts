import { CommonModule } from '@angular/common';
import { Component, ElementRef, HostListener, Input } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import {
  HtmlTooltipConfig,
  VicHtmlTooltipConfigBuilder,
  VicHtmlTooltipModule,
} from '../../../../viz-components-new/tooltips';
import { JobsBySchoolDatum } from '../../art-history-data.model';
import { ColorForFieldPipe } from '../../art-history-fields.pipe';
import { ArtHistoryFieldsService } from '../../art-history-fields.service';

@Component({
  selector: 'app-job-chart',
  imports: [CommonModule, VicHtmlTooltipModule, ColorForFieldPipe],
  providers: [VicHtmlTooltipConfigBuilder],
  templateUrl: './job-chart.component.html',
  styleUrls: ['./job-chart.component.scss'],
})
export class JobChartComponent {
  @Input() job: JobsBySchoolDatum;
  @Input() year: string;
  @Input() isFirstColumn: boolean;
  tooltipConfig: BehaviorSubject<HtmlTooltipConfig> =
    new BehaviorSubject<HtmlTooltipConfig>(null);
  tooltipConfig$ = this.tooltipConfig.asObservable();

  @HostListener('mouseenter', ['$event']) onMouseEnter(
    event: PointerEvent
  ): void {
    this.updateTooltipConfig(event.target as HTMLElement);
  }

  @HostListener('mouseleave') onMouseLeave(): void {
    this.updateTooltipConfig();
  }

  constructor(
    private tooltip: VicHtmlTooltipConfigBuilder,
    public fieldsService: ArtHistoryFieldsService,
    private elRef: ElementRef
  ) {}

  updateTooltipConfig(el?: HTMLElement): void {
    this.tooltip
      .size((size) => size.minWidth(220))
      .show(el ? true : false)
      .panelClass('explore-time-range-tooltip')
      .origin(new ElementRef(el))
      .offsetFromOriginPosition((x) =>
        x.offsetX(this.elRef.nativeElement.offsetWidth / 2).offsetY(0)
      )
      .getConfig();
    // const config = new HtmlTooltipConfig();
    // config.panelClass = 'explore-time-range-tooltip';
    // config.position = new HtmlTooltipOffsetFromOriginPosition();
    // config.origin = new ElementRef(el);
    // config.size.minWidth = 220;
    // config.position.offsetX = this.elRef.nativeElement.offsetWidth / 2;
    // config.position.offsetY = 0;
    // config.show = true;
    // this.tooltipConfig.next(config);
  }
}
