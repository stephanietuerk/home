import { Component, OnInit } from '@angular/core';
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
    }

    scrollToTop(event: any): void {
        const element = event.target.parentNode.parentNode;
        console.log(element);
        element.scrollTo({ top: 0, behavior: 'smooth' });
    }

    scrollToSection(event: any, section: any): void {
        const element = document.getElementById(`${section}-id`) as HTMLElement;
        const ySection = element.getBoundingClientRect().top;
        const container = element.parentNode as HTMLElement;
        const yContainer = container.getBoundingClientRect().top;
        const appLanding = event.target.parentNode.parentNode.parentNode;
        appLanding.scrollTo({ top: ySection - yContainer, behavior: 'smooth' });
    }
}
