import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { LEAVING_ME, LEAVING_OVERVIEW, LEAVING_YOU } from './leaving.constants';
import { QuestionComponent } from './question/question.component';

@Component({
  selector: 'app-leaving',
  imports: [CommonModule, QuestionComponent],
  templateUrl: './leaving.component.html',
  styleUrls: ['./leaving.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class LeavingComponent implements OnInit {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  whatQuestion: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  whoQuestion: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  meQuestions: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  youQuestions: any;
  state: { [index: string]: boolean };
  hovered = false;

  ngOnInit(): void {
    this.whatQuestion = LEAVING_OVERVIEW[0];
    this.whoQuestion = LEAVING_OVERVIEW[1];
    this.meQuestions = LEAVING_ME;
    this.youQuestions = LEAVING_YOU;
    this.initializeState();
  }

  initializeState(): void {
    this.state = [...this.meQuestions, ...this.youQuestions].reduce(
      (state, question) => {
        state[question.id] = false;
        return state;
      },
      {}
    );
  }

  toggleQuestion(questionId): void {
    this.state[questionId] = !this.state[questionId];
  }

  getIcon(questionId): string {
    return this.state[questionId] ? 'row-arrow-up' : 'row-arrow-down';
  }

  onTldrClick(): void {
    const el = document.getElementById(
      this.youQuestions[this.youQuestions.length - 2].id
    );
    el.scrollIntoView({ behavior: 'smooth' });
  }
}
