import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { SECTIONS } from '../../core/constants/sections.constants';

@Component({
  selector: 'app-navbar',
  imports: [CommonModule],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent {
  @Output() scrollTo = new EventEmitter<SECTIONS | 'top'>();
  sectionValues = Object.values(SECTIONS);
  scrollToId: any;

  scrollToTop(): void {
    this.scrollTo.emit('top');
  }

  scrollToSection(event: any, section: SECTIONS): void {
    this.scrollTo.emit(section);
  }
}
