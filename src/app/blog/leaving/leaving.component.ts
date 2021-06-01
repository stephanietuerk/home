import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { LEAVING_ME, LEAVING_OVERVIEW, LEAVING_YOU } from './leaving.constants';

@Component({
    selector: 'app-leaving',
    templateUrl: './leaving.component.html',
    styleUrls: ['./leaving.component.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class LeavingComponent implements OnInit {
    overviewQuestions: any;
    meQuestions: any;
    youQuestions: any;
    state: { [index: string]: boolean };

    constructor() {}

    ngOnInit() {
        this.overviewQuestions = LEAVING_OVERVIEW;
        this.meQuestions = LEAVING_ME;
        this.youQuestions = LEAVING_YOU;
        this.initializeState();
    }

    initializeState(): void {
        this.state = [...this.meQuestions, ...this.youQuestions].reduce((state, question) => {
            state[question.id] = false;
            return state;
        }, {});
    }

    toggleQuestion(questionId): void {
        this.state[questionId] = !this.state[questionId];
    }

    getIcon(questionId): string {
        return this.state[questionId] ? 'row-arrow-up' : 'row-arrow-down';
    }
}
