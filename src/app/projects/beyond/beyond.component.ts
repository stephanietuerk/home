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
    demoIsChange: boolean = false;
    electionYear: string = '2016';
    electionType: string = 'usp';
    demoType: string = 'popDensity';

    constructor(private beyondService: BeyondService) {}

    ngOnInit() {
        this.demoTypeLabels = BEYOND_DEMOTYPES;
        this.demoYearLabels = BEYOND_DEMOYEARS;
        this.electionTypeLabels = BEYOND_ELECTIONTYPES;
        this.electionYearLabels = BEYOND_ELECTIONYEARS;
        this.beyondService.setBeyondData();
        this.makeVis();
    }

    updateElectionYear(evt): void {
        this.electionYear = evt.target.value;
    }

    updateElectionType(evt): void {
        this.electionType = evt.target.value;
    }

    updateDemoType(evt): void {
        this.demoType = evt.target.value;
    }

    toggleDemoYear(): void {
        this.demoIsChange = !this.demoIsChange;
    }

    isSelectedElectionYear(year: string): boolean {
        return year === this.electionYear;
    }

    isSelectedElectionType(type: string): boolean {
        return type === this.electionType;
    }

    isSelectedDemoType(type: string): boolean {
        return type === this.demoType;
    }

    makeVis() {
        this.makeBarChart();
    }

    makeBarChart() {}
}
