import { Component, OnInit } from '@angular/core';
import { SelectionType } from '../explore-selections/explore-selections.model';

@Component({
    selector: 'app-explore-selections-navbar',
    templateUrl: './explore-selections-navbar.component.html',
    styleUrls: ['./explore-selections-navbar.component.scss'],
})
export class ExploreSelectionsNavbarComponent implements OnInit {
    constructor() {}

    ngOnInit(): void {}

    toggleDropdown(dropdown: SelectionType) {}
}
