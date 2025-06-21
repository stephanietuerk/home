import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  Input,
  OnInit,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { SafeHtml } from '@angular/platform-browser';
import mermaid from 'mermaid';

@Component({
  selector: 'app-mermaid-diagram',
  imports: [],
  templateUrl: './mermaid-diagram.component.html',
  styleUrl: './mermaid-diagram.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class MermaidDiagramComponent implements OnInit, AfterViewInit {
  @Input() diagram: string = '';
  @Input() fontSize: string = '14px';
  @Input() fontFamily: string = 'Arial, sans-serif';
  @Input() lineColor: string = '#000';
  @ViewChild('mermaidDiv', { static: true }) mermaidDiv!: ElementRef;

  renderedDiagram: SafeHtml = '';
  diagramId: string = '';

  ngOnInit(): void {
    mermaid.initialize({
      startOnLoad: false,
      theme: 'base',
      themeVariables: {
        fontSize: this.fontSize,
        fontFamily: this.fontFamily,
        lineColor: this.lineColor, // handles arrow color on lines, line color themselves can be overriden with CSS var but not for arrow
      },
    });
  }

  async ngAfterViewInit(): Promise<void> {
    if (this.diagram) {
      await this.renderDiagram();
    }
  }

  private async renderDiagram(): Promise<void> {
    if (!this.diagram?.trim()) return;

    try {
      // Clear any existing content
      this.mermaidDiv.nativeElement.innerHTML = '';

      // Generate unique ID
      this.diagramId = `mermaid-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

      // Create a temporary div for rendering
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = this.diagram;

      const { svg } = await mermaid.render(this.diagramId, this.diagram);

      // Set the rendered SVG
      this.mermaidDiv.nativeElement.innerHTML = svg;
    } catch (error) {
      console.error('Error rendering mermaid diagram:', error);
      this.mermaidDiv.nativeElement.innerHTML =
        '<p>Error rendering diagram</p>';
    }
  }
}
