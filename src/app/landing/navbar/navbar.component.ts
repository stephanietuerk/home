import { Component, OnInit, Output } from '@angular/core';
import { EventEmitter } from '@angular/core';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent {
  @Output() selection = new EventEmitter();
  public sections: string[] = ['about', 'projects'];
  selected: string;

  constructor() {}

  setSelection(selection: string) {
    this.selected = selection;
    this.selection.emit(selection);
  }
}
