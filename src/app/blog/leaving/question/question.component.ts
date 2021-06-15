import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { LeavingQuestion } from '../leaving,model';

@Component({
    selector: 'app-question',
    templateUrl: './question.component.html',
    styleUrls: ['./question.component.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class QuestionComponent implements OnInit {
    @Input() question: LeavingQuestion;
    @Input() toggle: boolean;
    expanded: boolean = false;

    constructor() {}

    ngOnInit(): void {}

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
