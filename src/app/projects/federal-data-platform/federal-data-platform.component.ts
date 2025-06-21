import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MermaidDiagramComponent } from '../../shared/components/mermaid-diagram/mermaid-diagram.component';
import { ProjectArrowComponent } from '../../shared/components/project-arrow/project-arrow.component';
import { selectionValidationDiagram } from './federal-data-platform-constants';

@Component({
  selector: 'app-federal-data-platform',
  imports: [CommonModule, ProjectArrowComponent, MermaidDiagramComponent],
  templateUrl: './federal-data-platform.component.html',
  styleUrl: './federal-data-platform.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FederalDataPlatformComponent {
  scorecardHovered: boolean = false;
  coresetHovered: boolean = false;
  selectionDiagram = selectionValidationDiagram;
  newScreenshotsExpanded: 'none' | 'right-first' | 'left-first' = 'none';

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
