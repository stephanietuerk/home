import { Component, OnInit } from '@angular/core';
import { BEYOND_DEMOTYPES, BEYOND_DEMOYEARS, BEYOND_ELECTIONTYPES, BEYOND_ELECTIONYEARS } from './beyond.constants';
import { BeyondService } from './services/beyond.service';

@Component({
    selector: 'app-beyond',
    templateUrl: './beyond.component.html',
    styleUrls: ['./beyond.component.scss'],
})
export class BeyondComponent implements OnInit {
    divId: string = '#fbeyond-the-county-line';
    introId: string = '#beyond-intro';
    demoTypeLabels: any[];
    demoYearLabels: any[];
    electionTypeLabels: any[];
    electionYearLabels: any[];

    constructor(private beyondService: BeyondService) {}

    ngOnInit() {
        this.demoTypeLabels = BEYOND_DEMOTYPES;
        this.demoYearLabels = BEYOND_DEMOYEARS;
        this.electionTypeLabels = BEYOND_ELECTIONTYPES;
        this.electionYearLabels = BEYOND_ELECTIONYEARS;
        this.beyondService.setBeyondData();
        this.makeVis();
    }

    isSelectedElectionYear(year: string): boolean {
        return year === '2016';
    }

    isSelectedElectionType(type: string): boolean {
        return type === 'usp';
    }

    isSelectedDemoType(type: string): boolean {
        return type === 'popDensity';
    }

    makeVis() {}
}
