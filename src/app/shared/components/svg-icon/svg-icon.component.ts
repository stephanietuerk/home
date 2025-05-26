import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit,
} from '@angular/core';
import { SvgIconService } from './svg-icon.service';

@Component({
  selector: 'app-svg-icon',
  standalone: true,
  template: `<svg
    [attr.width]="width || size"
    [attr.height]="height || size"
    [attr.fill]="color"
    [attr.preserveAspectRatio]="preserveAspectRatio"
  >
    <use [attr.href]="'#icon-' + name"></use>
  </svg>`,
  styles: [
    `
      :host {
        display: inline-block;
        line-height: 0;
      }
      svg {
        vertical-align: middle;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SvgIconComponent implements OnInit {
  @Input() name: string = '';
  @Input() width: string;
  @Input() height: string;
  @Input() size: string = '24px';
  @Input() color: string = 'currentColor';
  @Input() preserveAspectRatio: string = null;

  constructor(private svgIconService: SvgIconService) {}

  ngOnInit(): void {
    this.svgIconService.loadSvgSprite().catch((error) => {
      console.error('Error loading SVG sprite:', error);
    });
  }
}
