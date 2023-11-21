import {
  Component,
  ElementRef,
  HostListener,
  Input,
  ViewContainerRef,
} from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { OverlayService } from 'src/app/core/services/overlay.service';
import {
  HtmlTooltipConfig,
  HtmlTooltipOffsetFromOriginPosition,
} from 'src/app/viz-components/tooltips/html-tooltip/html-tooltip.config';
import { JobsBySchoolDatum } from '../../art-history-data.model';
import { ArtHistoryFieldsService } from '../../art-history-fields.service';

@Component({
  selector: 'app-job-chart',
  templateUrl: './job-chart.component.html',
  styleUrls: ['./job-chart.component.scss'],
  providers: [OverlayService],
})
export class JobChartComponent {
  @Input() job: JobsBySchoolDatum;
  @Input() year: string;
  @Input() isFirstColumn: boolean;
  tooltipConfig: BehaviorSubject<HtmlTooltipConfig> =
    new BehaviorSubject<HtmlTooltipConfig>(
      new HtmlTooltipConfig({ show: false })
    );
  tooltipConfig$ = this.tooltipConfig.asObservable();

  @HostListener('mouseenter', ['event']) onMouseEnter(
    event: PointerEvent
  ): void {
    this.updateTooltipConfig();
  }

  @HostListener('mouseleave', ['event']) onMouseLeave(
    event: PointerEvent
  ): void {
    this.tooltipConfig.next(new HtmlTooltipConfig({ show: false }));
  }

  constructor(
    public fieldsService: ArtHistoryFieldsService,
    private elRef: ElementRef,
    private viewContainerRef: ViewContainerRef
  ) {}

  updateTooltipConfig(): void {
    const config = new HtmlTooltipConfig();
    config.panelClass = 'explore-time-range-tooltip';
    config.position = new HtmlTooltipOffsetFromOriginPosition();
    config.origin = this.elRef.nativeElement;
    config.size.minWidth = 200;
    config.position.offsetX = this.elRef.nativeElement.offsetWidth / 2;
    config.position.offsetY = -16;
    config.show = true;
    this.tooltipConfig.next(config);
  }
}
