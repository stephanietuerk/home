import { Component, OnInit } from '@angular/core';
import { LEAVING_QUESTIONS } from './leaving.constants';

@Component({
    selector: 'app-leaving',
    templateUrl: './leaving.component.html',
    styleUrls: ['./leaving.component.scss'],
})
export class LeavingComponent implements OnInit {
    questions: any;

    constructor() {}

    ngOnInit() {
        this.questions = LEAVING_QUESTIONS;
    }
}
