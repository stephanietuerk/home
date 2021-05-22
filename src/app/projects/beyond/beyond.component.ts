import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { BEYOND_DEMOTYPES, BEYOND_DEMOYEARS, BEYOND_ELECTIONTYPES, BEYOND_ELECTIONYEARS } from './beyond.constants';
import { DemoTime, DemoVariable, ElectionType, ElectionYear } from './models/beyond-enums.model';
@Component({
    selector: 'app-beyond',
    templateUrl: './beyond.component.html',
    styleUrls: ['./beyond.component.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class BeyondComponent implements OnInit {
    electionYear: string;
    electionType: string;
    demoType: string;
    demoYear: string;
    demoTypeLabels: any[];
    demoYearLabels: any[];
    electionTypeLabels: any[];
    electionYearLabels: any[];

    constructor() {}

    ngOnInit() {
        this.initSelections();
        this.demoTypeLabels = BEYOND_DEMOTYPES;
        this.demoYearLabels = BEYOND_DEMOYEARS;
        this.electionTypeLabels = BEYOND_ELECTIONTYPES;
        this.electionYearLabels = BEYOND_ELECTIONYEARS;
    }

    initSelections(): void {
        this.electionType = ElectionType.president;
        this.electionYear = ElectionYear._2016;
        this.demoType = DemoVariable.populationDensity;
        this.demoYear = DemoTime.current;
    }

    updateSelection(key: string, value: string): void {
        this[key] = value;
    }

    updateElectionYear(value: string): void {
        this.electionYear = value;
    }

    updateElectionType(value: string): void {
        this.electionType = value;
    }

    updateDemoType(value: string): void {
        this.demoType = value;
    }

    updateDemoYear(): void {
        if (this.demoYear === DemoTime.change) {
            this.demoYear = DemoTime.current;
        } else {
            this.demoYear = DemoTime.change;
        }
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

    getElectionTypeTitle(): string {
        return this.electionTypeLabels.find((x) => x.value === this.electionType).title;
    }

    getTitleElement(prop: string, type: string): string {
        const property = `${prop}${type[0].toUpperCase() + type.substring(1)}`;
        return this[`${property}Labels`].find((x) => x.value === this[`${property}`]).title;
    }
}
