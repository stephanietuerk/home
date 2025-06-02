import {
  AfterContentInit,
  Component,
  ContentChild,
  ContentChildren,
  QueryList,
} from '@angular/core';
import { Observable, map, startWith } from 'rxjs';
import { ComboboxService } from '../combobox.service';
import { ListboxLabelComponent } from '../listbox-label/listbox-label.component';
import { ListboxOptionComponent } from '../listbox-option/listbox-option.component';

@Component({
  selector: 'app-listbox-group',
  template: `<ng-content></ng-content>`,
  host: {
    class: 'listbox-group',
  },
})
export class ListboxGroupComponent implements AfterContentInit {
  @ContentChild(ListboxLabelComponent)
  label: ListboxLabelComponent;
  @ContentChildren(ListboxOptionComponent)
  options: QueryList<ListboxOptionComponent>;
  options$: Observable<ListboxOptionComponent[]>;

  constructor(public service: ComboboxService) {}

  ngAfterContentInit(): void {
    this.options$ = this.options.changes.pipe(
      startWith(''),
      map(() => this.options.toArray())
    );
  }
}
