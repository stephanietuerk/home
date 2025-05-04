import { CommonModule } from '@angular/common';
import { Component, Input, ViewEncapsulation } from '@angular/core';
import { SvgIconComponent } from '../../../shared/components/svg-icon/svg-icon.component';
import { LeavingQuestion } from '../leaving,model';

@Component({
  selector: 'app-question',
  standalone: true,
  imports: [CommonModule, SvgIconComponent],
  templateUrl: './question.component.html',
  styleUrls: ['./question.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class QuestionComponent {
  @Input() question: LeavingQuestion;
  @Input() toggle: boolean;
  expanded = false;

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
