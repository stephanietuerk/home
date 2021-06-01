import { Component, OnInit } from '@angular/core';
import { scrollToId } from 'src/app/core/utilities/dom.utils';
import { SECTIONS } from '../../core/constants/sections.constants';

@Component({
    selector: 'app-navbar',
    templateUrl: './navbar.component.html',
    styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent implements OnInit {
    sections: string[];
    scrollToId: any;

    constructor() {}

    ngOnInit() {
        this.sections = Object.values(SECTIONS);
        this.scrollToId = scrollToId;
    }

    scrollToTop(event: any): void {
        const element = event.target.parentNode.parentNode;
        element.scrollTo({ top: 0, behavior: 'smooth' });
    }
}
