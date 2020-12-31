import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { SECTIONS } from '../../core/constants/sections.constants';

@Component({
    selector: 'app-about',
    templateUrl: './about.component.html',
    styleUrls: ['./about.component.scss'],
})
export class AboutComponent implements OnInit {
    sections: any;

    constructor() {}

    ngOnInit() {
        this.sections = SECTIONS;
    }
}
