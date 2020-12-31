import { Component, OnInit } from '@angular/core';
import { SECTIONS } from '../../core/constants/sections.constants';
import { ElementService } from '../../core/services/element.service';

@Component({
    selector: 'app-navbar',
    templateUrl: './navbar.component.html',
    styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
    sections: string[];

    constructor(public elementService: ElementService) {}

    ngOnInit() {
        this.sections = Object.values(SECTIONS);
    }

    scrollToTop(event: any): void {
        const element = event.target.parentNode.parentNode;
        element.scrollTo({ top: 0, behavior: 'smooth'});
    }
}
