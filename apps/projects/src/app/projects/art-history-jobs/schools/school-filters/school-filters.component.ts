import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  Component,
  DestroyRef,
  ElementRef,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { debounceTime, fromEvent } from 'rxjs';
import { SearchUtilities } from 'src/app/core/utilities/search.util';
import { ComboboxModule } from '../../../../shared/components/combobox/combobox.module';
import { SvgIconComponent } from '../../../../shared/components/svg-icon/svg-icon.component';
import {
  SchoolSort,
  SchoolStateProperty,
  SchoolsDataService,
} from '../schools-data.service';

@Component({
  selector: 'app-school-filters',
  imports: [
    CommonModule,
    MatButtonToggleModule,
    ComboboxModule,
    SvgIconComponent,
  ],
  templateUrl: './school-filters.component.html',
  styleUrls: ['./school-filters.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class SchoolFiltersComponent implements AfterViewInit {
  @ViewChild('searchInput') searchInput: ElementRef;
  SchoolStateProperty = SchoolStateProperty;
  SchoolSort = SchoolSort;

  constructor(
    public data: SchoolsDataService,
    private destroyRef: DestroyRef
  ) {}

  ngAfterViewInit(): void {
    this.setSearchInput();
  }

  setSearchInput() {
    fromEvent(this.searchInput.nativeElement, 'input')
      .pipe(takeUntilDestroyed(this.destroyRef), debounceTime(100))
      .subscribe((event: Event) => {
        const value = (event.target as HTMLInputElement).value;
        const terms = SearchUtilities.getCleanedSearchTerms(value);
        this.data.updateState(terms, SchoolStateProperty.searchTerms);
      });
  }

  clearSearch() {
    this.searchInput.nativeElement.value = '';
    this.searchInput.nativeElement.dispatchEvent(new Event('input'));
    this.data.updateState([], SchoolStateProperty.searchTerms);
  }
}
