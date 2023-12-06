import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  Input,
  OnDestroy,
  OnInit,
  TemplateRef,
  ViewChild,
  ViewContainerRef,
  ViewEncapsulation,
} from '@angular/core';
import { FormArray, FormControl, FormGroup } from '@angular/forms';
import { isEqual } from 'lodash';
import { Subject } from 'rxjs';
import {
  debounceTime,
  map,
  pairwise,
  startWith,
  takeUntil,
} from 'rxjs/operators';
import { animations } from 'src/app/core/constants/animations.constants';
import {
  ConnectedOverlayConfig,
  OverlayService,
  aboveLeftAligned,
  belowLeftAligned,
} from 'src/app/core/services/overlay.service';
import { SelectionOption } from 'src/app/shared/components/form-components/form-radio-input/form-radio-input.model';
import { Unsubscribe } from 'src/app/shared/unsubscribe.directive';
import { artHistoryFields } from '../../art-history-fields.constants';
import { ExploreDataService } from '../explore-data.service';
import {
  ExploreSelectionsFormGroup,
  ExploreSelectionsFormService,
} from './explore-selections-form.service';
import {
  dataTypeOptions,
  filterUseOptions,
  rankOptions,
  tenureOptions,
} from './explore-selections.constants';
import {
  ExploreFormSelections,
  ExploreSelections,
  ExploreSelectionsDefaults,
  FilterType,
  ValueType,
} from './explore-selections.model';

@Component({
  selector: 'app-explore-selections',
  templateUrl: './explore-selections.component.html',
  styleUrls: ['./explore-selections.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [animations.slide('selection-interface')],
  providers: [OverlayService],
})
export class ExploreSelectionsComponent
  extends Unsubscribe
  implements OnInit, OnDestroy
{
  @Input() yearsRange: [number, number];
  @ViewChild('fieldsDd') fieldsDropdown: TemplateRef<HTMLDivElement>;
  @ViewChild('dataTypeDd') dataTypeDropdown: TemplateRef<HTMLDivElement>;
  @ViewChild('timeRangeDd') timeRangeDropdown: TemplateRef<HTMLDivElement>;
  @ViewChild('tenureDd') tenureDropdown: TemplateRef<HTMLDivElement>;
  @ViewChild('rankDd') rankDropdown: TemplateRef<HTMLDivElement>;
  @ViewChild('ddOrigin') dropdownOrigin: ElementRef<HTMLButtonElement>;
  FormArray = FormArray;
  FormControl = FormControl;
  form: FormGroup<ExploreSelectionsFormGroup>;
  tenureIsFilter = false;
  rankIsFilter = true;
  dataTypeOptions: SelectionOption[] = dataTypeOptions;
  artHistoryFields = artHistoryFields;
  fieldOptions: SelectionOption[] = artHistoryFields.map((x) => {
    return { label: x.name.short, value: x.name.full, selected: x.selected };
  });
  filterUseOptions = filterUseOptions;
  tenureValueOptions = tenureOptions;
  rankValueOptions = rankOptions;
  filtersFormArray: FormArray;
  filtersFormControl: FormControl;
  defaults: ExploreSelectionsDefaults;
  debouncer: Subject<ExploreSelections> = new Subject<ExploreSelections>();
  isOpen = false;
  openContent: 'fields' | 'dataType' | 'timeRange' | 'tenure' | 'rank' | null;

  get fields(): FormArray<FormControl<boolean>> {
    return this.form.controls.fields;
  }

  get tenureDisaggValues(): FormArray<FormControl<boolean>> {
    return this.form.get('tenureDisaggValues') as FormArray;
  }

  get rankDisaggValues(): FormArray<FormControl<boolean>> {
    return this.form.get('rankDisaggValues') as FormArray;
  }

  constructor(
    private formService: ExploreSelectionsFormService,
    private dataService: ExploreDataService,
    private overlayService: OverlayService,
    private viewContainerRef: ViewContainerRef
  ) {
    super();
    this.debouncer
      .pipe(debounceTime(200))
      .subscribe((x) => this.dataService.updateSelections(x));
  }

  ngOnInit(): void {
    this.setDefaultSelections();
    this.initializeForm();
    this.subscribeToFormChanges();
    this.subscribeToFieldsChanges();
    this.subscribeToFilterUseChanges();
  }

  override ngOnDestroy(): void {
    super.ngOnDestroy();
    this.overlayService.destroyOverlay();
  }

  setDefaultSelections(): void {
    this.defaults = {
      dataType: ValueType.count,
      years: {
        start: this.yearsRange[0],
        end: this.yearsRange[1],
      },
      fields: this.getSelectedValues(this.fieldOptions),
      tenureUse: FilterType.disaggregate,
      tenureFilterValue: this.tenureValueOptions[0].label as string,
      tenureDisaggValues: this.getSelectedLabels(this.tenureValueOptions),
      rankUse: FilterType.filter,
      rankFilterValue: this.rankValueOptions[0].label as string,
      rankDisaggValues: this.getSelectedLabels(this.rankValueOptions),
    };
  }

  initializeForm(): void {
    this.form = this.formService.createForm(this.defaults);
    this.initializeFieldsFormArray();
    this.initializeTenureDisaggValuesFormArray();
    this.initializeRankDisaggValuesFormArray();
    const selections = this.getSelectionsFromFormValues(this.form.value);
    this.emitSelections(selections);
  }

  getSelectedLabels(options: SelectionOption[]): string[] {
    return options.filter((x) => x.selected).map((x) => x.label);
  }

  getSelectedValues(options: SelectionOption[]): string[] {
    return options.filter((x) => x.selected).map((x) => x.value as string);
  }

  initializeFieldsFormArray(): void {
    this.formService.initializeFormArray(this.fields, this.fieldOptions);
  }

  initializeTenureDisaggValuesFormArray(): void {
    this.formService.initializeFormArray(
      this.tenureDisaggValues,
      this.tenureValueOptions
    );
  }

  initializeRankDisaggValuesFormArray(): void {
    this.formService.initializeFormArray(
      this.rankDisaggValues,
      this.rankValueOptions
    );
  }

  subscribeToFieldsChanges(): void {
    const initialFields = this.form.value.fields;
    this.form
      .get('fields')
      .valueChanges.pipe(
        takeUntil(this.unsubscribe),
        startWith(initialFields),
        pairwise()
      )
      .subscribe(([prev, curr]) => {
        if (!curr.includes(true)) {
          this.resetFieldsToDefault();
        }
        if (!isEqual(curr, prev) && curr.filter((x) => !!x).length > 1) {
          if (this.form.value.tenureUse === FilterType.disaggregate) {
            this.form.controls.tenureUse.setValue(FilterType.filter);
          }
          if (this.form.value.rankUse === FilterType.disaggregate) {
            this.form.controls.rankUse.setValue(FilterType.filter);
          }
        }
      });
  }

  subscribeToFilterUseChanges(): void {
    this.form
      .get('tenureUse')
      .valueChanges.pipe(
        takeUntil(this.unsubscribe),
        startWith(this.defaults.tenureUse),
        pairwise()
      )
      .pipe()
      .subscribe(([prev, curr]) => {
        if (prev !== curr) {
          this.updateSelectionsForNewTenureUse(curr);
        }
      });

    this.form
      .get('rankUse')
      .valueChanges.pipe(
        takeUntil(this.unsubscribe),
        startWith(this.defaults.rankUse),
        pairwise()
      )
      .pipe()
      .subscribe(([prev, curr]) => {
        if (prev !== curr) {
          this.updateSelectionsForNewRankUse(curr);
        }
      });
  }

  subscribeToFormChanges(): void {
    this.form.valueChanges
      .pipe(
        takeUntil(this.unsubscribe),
        map((values) => this.getSelectionsFromFormValues(values))
      )
      .subscribe((selections) => {
        this.emitSelections(selections);
      });
  }

  getSelectionsFromFormValues(
    formValues: Partial<ExploreFormSelections>
  ): ExploreSelections {
    const tenureValues =
      formValues.tenureUse === FilterType.filter
        ? [formValues.tenureFilterValue]
        : this.getSelectedValuesFromFormArray(
            this.tenureDisaggValues,
            this.tenureValueOptions
          );
    const rankValues =
      formValues.rankUse === FilterType.filter
        ? [formValues.rankFilterValue]
        : this.getSelectedValuesFromFormArray(
            this.rankDisaggValues,
            this.rankValueOptions
          );
    const selections: ExploreSelections = {
      dataType: formValues.dataType,
      years: {
        start: formValues.years.start,
        end: formValues.years.end,
      },
      fields: this.getSelectedValuesFromFormArray(
        this.fields,
        this.fieldOptions
      ),
      tenureUse: formValues.tenureUse,
      tenureValues,
      rankUse: formValues.rankUse,
      rankValues,
    };
    return selections;
  }

  updateSelectionsForNewTenureUse(tenureUse: FilterType): void {
    this.tenureIsFilter = tenureUse === FilterType.filter;
    if (!this.tenureIsFilter) {
      this.updateTenureInputsToDisagg();
      this.updateSelectedFieldsForFilterUseType();
      if (!this.rankIsFilter) {
        this.updateRankInputsToFilter();
        this.form.controls.rankUse.setValue(FilterType.filter);
      }
    } else {
      this.updateTenureInputsToFilter();
    }
  }

  updateSelectionsForNewRankUse(rankUse: FilterType): void {
    this.rankIsFilter = rankUse === FilterType.filter;
    if (!this.rankIsFilter) {
      this.updateRankInputsToDisagg();
      this.updateSelectedFieldsForFilterUseType();
      if (!this.tenureIsFilter) {
        this.updateTenureInputsToFilter();
        this.form.controls.tenureUse.setValue(FilterType.filter);
      }
    } else {
      this.updateRankInputsToFilter();
    }
  }

  updateTenureInputsToDisagg(): void {
    this.updateTenureDisaggValues();
    this.nullFilterValue('tenureFilterValue');
  }

  updateTenureInputsToFilter(): void {
    this.updateTenureFilterValue();
    this.nullTenureDisaggValues();
  }

  updateRankInputsToFilter(): void {
    this.updateRankFilterValue();
    this.nullRankDisaggValues();
  }

  updateRankInputsToDisagg(): void {
    this.updateRankDisaggValues();
    this.nullFilterValue('rankFilterValue');
  }

  updateTenureFilterValue(): void {
    const currentDisaggValues = this.form.value.tenureDisaggValues;
    if (currentDisaggValues.filter((x) => !!x).length === 1) {
      const selectedIndex = currentDisaggValues.findIndex((x) => !!x);
      this.form.controls.tenureFilterValue.setValue(
        this.tenureValueOptions[selectedIndex].label
      );
    } else {
      this.form.controls.tenureFilterValue.setValue(
        this.defaults.tenureFilterValue
      );
    }
  }

  updateRankFilterValue(): void {
    const currentDisaggValues = this.form.value.rankDisaggValues;
    if (currentDisaggValues.filter((x) => !!x).length === 1) {
      const selectedIndex = currentDisaggValues.findIndex((x) => !!x);
      this.form.controls.rankFilterValue.setValue(
        this.rankValueOptions[selectedIndex].label
      );
    } else {
      this.form.controls.rankFilterValue.setValue(
        this.defaults.rankFilterValue
      );
    }
  }

  nullFilterValue(control: string): void {
    this.form.get(control).setValue(null);
  }

  updateTenureDisaggValues(): void {
    const newDisaggValues = this.tenureValueOptions.map((x) =>
      x.value === 'All' ? false : true
    );
    this.tenureDisaggValues.setValue(newDisaggValues);
  }

  nullTenureDisaggValues(): void {
    this.tenureDisaggValues.controls.forEach((x) => {
      x.setValue(false);
    });
  }

  updateRankDisaggValues(): void {
    const newDisaggValues = this.rankValueOptions.map((x) =>
      x.value === 'All' ? false : true
    );
    this.rankDisaggValues.setValue(newDisaggValues);
  }

  nullRankDisaggValues(): void {
    this.rankDisaggValues.controls.forEach((x) => {
      x.setValue(false);
    });
  }

  resetFieldsToDefault(): void {
    this.fields.controls.forEach((x, i) => {
      x.setValue(this.fieldOptions[i].selected);
    });
  }

  updateSelectedFieldsForFilterUseType(): void {
    if (!this.rankIsFilter || !this.tenureIsFilter) {
      if (this.form.value.fields.filter((x) => !!x).length > 1) {
        const index = this.fields.value.findIndex((x) => x);
        const newValues = this.form.value.fields.map((x, i) =>
          i === index ? true : false
        );
        this.fields.setValue(newValues);
      }
    }
  }

  getSelectedValuesFromFormArray(
    fa: FormArray,
    options: SelectionOption[]
  ): string[] {
    return fa.value.reduce((acc, x, i) => {
      if (x) {
        acc.push(options[i].value ?? options[i].label);
      }
      return acc;
    }, []);
  }

  subscribeToRankUseChanges(): void {
    this.form.controls.rankUse.valueChanges
      .pipe(takeUntil(this.unsubscribe))
      .subscribe((value) => {
        this.rankIsFilter = value === FilterType.filter;
      });
  }

  emitSelections(selections: ExploreSelections): void {
    this.debouncer.next(selections);
  }

  initializeDropdownOverlay(): void {
    const config = this.overlayService.getOverlayConfig(
      new ConnectedOverlayConfig({
        scrollStrategy: 'close',
        connectedElementRef: this.dropdownOrigin,
        positions: [belowLeftAligned, aboveLeftAligned],
      })
    );
    this.overlayService.createOverlay(config);
    this.overlayService.overlayRef.backdropClick().subscribe(() => {
      this.openContent = null;
      this.isOpen = false;
      this.overlayService.detachOverlay();
    });
  }

  toggleOpenContent(
    selected: 'fields' | 'dataType' | 'timeRange' | 'tenure' | 'rank'
  ): void {
    if (this.openContent === selected) {
      this.openContent = null;
      this.isOpen = false;
      this.overlayService.detachOverlay();
    } else {
      this.openContent = selected;
      this.isOpen = true;
      if (!this.overlayService.overlayRef) {
        this.initializeDropdownOverlay();
      }
      this.attachOverlay(selected);
    }
  }

  attachOverlay(
    selected: 'fields' | 'dataType' | 'timeRange' | 'tenure' | 'rank'
  ): void {
    let template;
    switch (selected) {
      case 'fields':
        template = this.fieldsDropdown;
        break;
      case 'dataType':
        template = this.dataTypeDropdown;
        break;
      case 'timeRange':
        template = this.timeRangeDropdown;
        break;
      case 'tenure':
        template = this.tenureDropdown;
        break;
      case 'rank':
        template = this.rankDropdown;
        break;
    }
    this.overlayService.attachTemplate(template, this.viewContainerRef);
  }

  closeDropdown(event: MouseEvent): void {
    if (
      !(event.target as HTMLElement).parentElement.classList.contains(
        'links-container'
      )
    ) {
      this.openContent = null;
      this.isOpen = false;
    }
  }
}
