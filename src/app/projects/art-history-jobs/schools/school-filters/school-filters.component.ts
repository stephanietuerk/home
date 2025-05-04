import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { debounceTime, fromEvent, takeUntil } from 'rxjs';
import { SearchUtilities } from 'src/app/core/utilities/search.util';
import { Unsubscribe } from 'src/app/shared/unsubscribe.directive';
import { ComboboxModule } from '../../../../shared/components/combobox/combobox.module';
import {
  SchoolSort,
  SchoolStateProperty,
  SchoolsDataService,
} from '../schools-data.service';

@Component({
  selector: 'app-school-filters',
  standalone: true,
  imports: [CommonModule, MatButtonToggleModule, ComboboxModule],
  templateUrl: './school-filters.component.html',
  styleUrls: ['./school-filters.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class SchoolFiltersComponent
  extends Unsubscribe
  implements OnInit, AfterViewInit
{
  @ViewChild('searchInput') searchInput: ElementRef;
  SchoolStateProperty = SchoolStateProperty;
  SchoolSort = SchoolSort;

  constructor(public data: SchoolsDataService) {
    super();
  }

  ngOnInit(): void {
    this.data.init();
  }

  ngAfterViewInit(): void {
    this.setSearchInput();
  }

  setSearchInput() {
    fromEvent(this.searchInput.nativeElement, 'input')
      .pipe(takeUntil(this.unsubscribe), debounceTime(100))
      .subscribe((event: Event) => {
        const value = (event.target as HTMLInputElement).value;
        const terms = SearchUtilities.getCleanedSearchTerms(value);
        this.data.updateState(terms, SchoolStateProperty.searchTerms);
      });
  }

  clearSearch() {
    this.searchInput.nativeElement.value = '';
    this.searchInput.nativeElement.dispatchEvent(new Event('input'));
  }
}
