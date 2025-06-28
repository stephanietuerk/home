import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  OnInit,
  signal,
  WritableSignal,
} from '@angular/core';
import { CodeBlockComponent } from '../../shared/components/code-block/code-block.component';
import { MermaidDiagramComponent } from '../../shared/components/mermaid-diagram/mermaid-diagram.component';
import { ExpandableImageService } from '../case-study/expandable-image.service';
import {
  VIZ_CODE_SNIPPETS,
  VIZ_GLOBAL_SCALING_DIAGRAM,
  VIZ_GLOBAL_SCALING_DIAGRAM_2,
} from './data-viz-library-constants';

@Component({
  selector: 'app-data-viz-library',
  imports: [CodeBlockComponent, MermaidDiagramComponent, CommonModule],
  providers: [ExpandableImageService],
  templateUrl: './data-viz-library.component.html',
  styleUrl: './data-viz-library.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DataVizLibraryComponent implements OnInit {
  codesnippets = VIZ_CODE_SNIPPETS;
  diagram2 = VIZ_GLOBAL_SCALING_DIAGRAM_2;
  diagram = VIZ_GLOBAL_SCALING_DIAGRAM;
  docsScreenshotExpanded: WritableSignal<'top' | 'bottom' | 'none'> =
    signal('none');

  constructor(
    private destroyRef: DestroyRef,
    protected imageExpand: ExpandableImageService
  ) {}

  ngOnInit(): void {
    this.imageExpand.init(this.destroyRef);
  }

  toggleDocsImageExpansion(value: 'top' | 'bottom'): void {
    if (this.docsScreenshotExpanded() !== 'none') {
      this.docsScreenshotExpanded.set('none');
    } else {
      this.docsScreenshotExpanded.set(value);
    }
    this.imageExpand.showImageModal();
  }
}
