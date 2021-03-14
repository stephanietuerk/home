import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { zoom } from 'd3-zoom';
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
    divId: string = '#beyond-the-county-line';
    mapId: string = '#beyond-map';
    introId: string = '#beyond-intro';
    state: BeyondState;
    demoTypeLabels: any[];
    demoYearLabels: any[];
    electionTypeLabels: any[];
    electionYearLabels: any[];
    demoIsChange: boolean = false;
    electionYear: string = '2016';
    electionType: string = 'usp';
    demoType: string = 'popDensity';
    viewPlaceNames: boolean = true;
    mapZoom: any = zoom().scaleExtent([1, 10]);
    mapPath: any;

    constructor(private beyondService: BeyondService) {}

    ngOnInit() {
        this.beyondService.state.subscribe((state) => {
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
}
