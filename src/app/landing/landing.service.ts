import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { SECTIONS } from '../core/constants/sections.constants';


@Injectable({
  providedIn: 'root'
})
export class LandingService {
  sections: string[] = SECTIONS;
  selection: string;
  navSelection = new Subject<string>();
  navSelectionObs = this.navSelection.asObservable();

  updateSelection(selection: string): void {
    this.selection = selection;
    this.navSelection.next(selection);
    console.log(this.selection);
  }

  clearMessages() {
    this.selection = null;
    this.navSelection.next();
  }

  getSelection(): Observable<any> {
    return this.navSelection.asObservable();
  }
}
