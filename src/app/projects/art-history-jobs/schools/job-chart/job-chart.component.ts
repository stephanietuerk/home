import { CommonModule } from '@angular/common';
import { Component, ElementRef, HostListener, Input } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import {
  VicHtmlTooltipConfig,
  VicHtmlTooltipOffsetFromOriginPosition,
} from 'src/app/viz-components/tooltips/html-tooltip/html-tooltip.config';
import { VicHtmlTooltipModule } from 'src/app/viz-components/tooltips/html-tooltip/html-tooltip.module';
import { JobsBySchoolDatum } from '../../art-history-data.model';
import { ColorForFieldPipe } from '../../art-history-fields.pipe';
import { ArtHistoryFieldsService } from '../../art-history-fields.service';

@Component({
  selector: 'app-job-chart',
  standalone: true,
  imports: [CommonModule, VicHtmlTooltipModule, ColorForFieldPipe],
  templateUrl: './job-chart.component.html',
  styleUrls: ['./job-chart.component.scss'],
})
export class JobChartComponent {
  @Input() job: JobsBySchoolDatum;
  @Input() year: string;
  @Input() isFirstColumn: boolean;
  tooltipConfig: BehaviorSubject<VicHtmlTooltipConfig> =
    new BehaviorSubject<VicHtmlTooltipConfig>(
      new VicHtmlTooltipConfig({ show: false })
    );
  tooltipConfig$ = this.tooltipConfig.asObservable();

  @HostListener('mouseenter', ['$event']) onMouseEnter(
    event: PointerEvent
  ): void {
    this.updateTooltipConfig(event.target as HTMLElement);
  }

  @HostListener('mouseleave') onMouseLeave(): void {
    this.tooltipConfig.next(new VicHtmlTooltipConfig({ show: false }));
  }

  constructor(
    public fieldsService: ArtHistoryFieldsService,
    private elRef: ElementRef
  ) {}

  updateTooltipConfig(el: HTMLElement): void {
    const config = new VicHtmlTooltipConfig();
    config.panelClass = 'explore-time-range-tooltip';
    config.position = new VicHtmlTooltipOffsetFromOriginPosition();
    config.origin = new ElementRef(el);
    config.size.minWidth = 220;
    config.position.offsetX = this.elRef.nativeElement.offsetWidth / 2;
    config.position.offsetY = 0;
    config.show = true;
    this.tooltipConfig.next(config);
  }
}
