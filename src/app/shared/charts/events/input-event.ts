import { Directive, Input, OnInit } from '@angular/core';
import { Observable, takeUntil } from 'rxjs';
import { Unsubscribe } from '../../unsubscribe.directive';

@Directive()
export abstract class InputEventDirective extends Unsubscribe implements OnInit {
    @Input() inputEvent$: Observable<any>;

    abstract handleNewEvent(event: any): void;

    ngOnInit(): void {
        this.inputEvent$.pipe(takeUntil(this.unsubscribe)).subscribe((event) => this.handleNewEvent(event));
    }
}
