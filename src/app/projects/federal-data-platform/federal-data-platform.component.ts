import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  OnInit,
  signal,
} from '@angular/core';
import { MermaidDiagramComponent } from '../../shared/components/mermaid-diagram/mermaid-diagram.component';
import { ProjectArrowComponent } from '../../shared/components/project-arrow/project-arrow.component';
import { ExpandableImageService } from '../case-study/expandable-image.service';
import { SELECTION_VALIDATION_DIAGRAM } from './federal-data-platform-constants';

@Component({
  selector: 'app-federal-data-platform',
  imports: [CommonModule, ProjectArrowComponent, MermaidDiagramComponent],
  providers: [ExpandableImageService],
  templateUrl: './federal-data-platform.component.html',
  styleUrl: './federal-data-platform.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FederalDataPlatformComponent implements OnInit {
  scorecardHovered: boolean = false;
  coresetHovered: boolean = false;
  selectionDiagram = SELECTION_VALIDATION_DIAGRAM;
  newScreenshotsExpanded: 'none' | 'right-first' | 'left-first' = 'none';
  stateFocusScreenshotExpanded = signal(false);
  backdrop: HTMLDivElement;
  isCollapsedRightColumn = signal(false);

  constructor(
    private destroyRef: DestroyRef,
    protected imageExpand: ExpandableImageService
  ) {}

  ngOnInit(): void {
    this.imageExpand.init(this.destroyRef);
  }

  updateNewScreeshotsExpanded(value: 'left' | 'right'): void {
    if (value === 'left' && this.newScreenshotsExpanded === 'none') {
      this.newScreenshotsExpanded = 'left-first';
    } else if (value === 'right' && this.newScreenshotsExpanded === 'none') {
      this.newScreenshotsExpanded = 'right-first';
    } else {
      this.newScreenshotsExpanded = 'none';
    }
  }
}
