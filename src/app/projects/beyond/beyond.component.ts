import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { BEYOND_DEMOTYPES, BEYOND_DEMOYEARS, BEYOND_ELECTIONTYPES, BEYOND_ELECTIONYEARS } from './beyond.constants';
import { BeyondState } from './models/beyond-state.model';
import { BeyondService } from './services/beyond.service';
@Component({
    selector: 'app-beyond',
    templateUrl: './beyond.component.html',
    styleUrls: ['./beyond.component.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class BeyondComponent implements OnInit {
    state: BeyondState;
    demoTypeLabels: any[];
    demoYearLabels: any[];
    electionTypeLabels: any[];
    electionYearLabels: any[];
    private destroy$ = new Subject();

    constructor(private beyondService: BeyondService) {}

    ngOnInit() {
        this.beyondService.state.pipe(takeUntil(this.destroy$)).subscribe((state) => {
            this.state = state;
        });
        this.demoTypeLabels = BEYOND_DEMOTYPES;
        this.demoYearLabels = BEYOND_DEMOYEARS;
        this.electionTypeLabels = BEYOND_ELECTIONTYPES;
        this.electionYearLabels = BEYOND_ELECTIONYEARS;
    }

    updateState(evt): void {
        this.beyondService.updateState(evt.target.name, evt.target.value);
    }

    toggleDemoYear(): void {
        this.beyondService.updateState('demoIsChange', !this.state.demoIsChange);
    }

    isSelectedElectionYear(year: string): boolean {
        return year === this.state.electionYear;
    }

    isSelectedElectionType(type: string): boolean {
        return type === this.state.electionType;
    }

    isSelectedDemoType(type: string): boolean {
        return type === this.state.demoType;
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
