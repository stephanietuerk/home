import { CommonModule } from '@angular/common';
import { Component, Input, ViewEncapsulation } from '@angular/core';
import { ExpandArrowComponent } from '../../../shared/components/expand-arrow/expand-arrow.component';
import { LeavingQuestion } from '../leaving,model';

@Component({
  selector: 'app-question',
  imports: [CommonModule, ExpandArrowComponent],
  templateUrl: './question.component.html',
  styleUrls: ['./question.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class QuestionComponent {
  @Input() question: LeavingQuestion;
  @Input() toggle: boolean;
  expanded = false;
  hovered = false;

  toggleQuestion(): void {
    this.expanded = !this.expanded;
  }

  getIcon(): string {
    return this.expanded ? 'row-arrow-up' : 'row-arrow-down';
  }

  textIsHtml(): boolean {
    return this.question.type === 'html';
  }
}
