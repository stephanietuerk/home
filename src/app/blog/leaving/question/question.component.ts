import { Component, Input, ViewEncapsulation } from '@angular/core';
import { LeavingQuestion } from '../leaving,model';

@Component({
  selector: 'app-question',
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
