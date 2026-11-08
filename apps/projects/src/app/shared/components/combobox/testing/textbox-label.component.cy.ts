/* eslint-disable @angular-eslint/prefer-standalone */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { CommonModule } from '@angular/common';
import { Component, ViewEncapsulation } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import 'cypress-real-events';
import { beforeEach, cy, describe, it } from 'local-cypress';
import { BehaviorSubject } from 'rxjs';
import { ComboboxModule } from '../combobox.module';
import { ListboxOptionComponent } from '../listbox-option/listbox-option.component';
import { ComboboxBaseTestComponent, scss } from './combobox-testing.constants';

// SPECIFICATIONS
// - By default, the textbox label will initially show a boxLabel, and then will show the label(s) of the selected options.
// - If the combobox is multi-select, the default label will separate the selected option names, if more than one is selected with ', '.
// - If no boxLabel is provided, the initial label will be empty.
// - If dynamicLabel is set to false, the textbox label will always be the boxLabel if provided, or empty.
// - If count label is configured, it initially shows a boxLabel, or emtpy if no boxLabel, and then will show the count of selected options.
// - If a customLabel function is provided, it initially shows a boxLabel, or empty if no boxLabel, and then will show the result of the customLabel function.
// - If a selectAll option is provided and is selected, the label for the option will not appear in the textbox label or be counted as part of the count label or be passed to the customLabel function.
// - If a combobox has options that are selected initially by the user, the textbox label will not use the boxLabel behavior on initial render, and will instead show either the selected options, the count label, or the custom label.
// - If options are changed externally after the combobox is initialized (e.g. if the user's array that makes options changes), the textbox label will update to reflect the new selection(s), count, or custom label result.
// - If the selected property of an option is changed externally by the user, the textbox label will update to reflect the new selection(s), count, or custom label result.

@Component({
  selector: 'app-combobox-default-label-single-test',
  template: `
    <p class="outside-element"
      >Throwaway element to click on for outside combobox click</p
    >
    <p class="combobox-value">{{ value$ | async }}</p>
    <app-combobox class="fruits-dropdown">
      <app-textbox>
        <p boxLabel>Select a fruit</p>
        <span
          aria-hidden="true"
          class="material-symbols-outlined expand-more"
          boxIcon
        >
          expand_more
        </span>
      </app-textbox>
      <app-listbox (valueChanges)="onSelection($event)">
        @for (option of options; track option.id) {
          <app-listbox-option>{{ option.displayName }}</app-listbox-option>
        }
      </app-listbox>
    </app-combobox>
  `,
  encapsulation: ViewEncapsulation.None,
  styles: [scss],
  imports: [ComboboxModule, MatIconModule, CommonModule],
})
class ComboboxDynamicLabelTestComponent extends ComboboxBaseTestComponent {}

describe('Single-select combobox with a default (dynamic) label', () => {
  beforeEach(() => {
    cy.mount(ComboboxDynamicLabelTestComponent);
  });
  it('textbox label shows the boxLabel before there is a selection, and the selected value afterwards', () => {
    cy.get('.textbox-label').should('have.text', 'Select a fruit');
    cy.get('.textbox').click();
    cy.get('.listbox-option').first().realClick();
    cy.get('.textbox-label').should('have.text', 'Apples');
    cy.get('.textbox').click();
    cy.get('.listbox-option').eq(1).realClick();
    cy.get('.textbox-label').should('have.text', 'Bananas');
  });
});

@Component({
  selector: 'app-combobox-no-box-label-single-test',
  template: `
    <p class="outside-element"
      >Throwaway element to click on for outside combobox click</p
    >
    <p class="combobox-value">{{ value$ | async }}</p>
    <app-combobox class="fruits-dropdown">
      <app-textbox>
        <span
          aria-hidden="true"
          class="material-symbols-outlined expand-more"
          boxIcon
        >
          expand_more
        </span>
      </app-textbox>
      <app-listbox (valueChanges)="onSelection($event)">
        @for (option of options; track option.id) {
          <app-listbox-option>{{ option.displayName }}</app-listbox-option>
        }
      </app-listbox>
    </app-combobox>
  `,
  encapsulation: ViewEncapsulation.None,
  styles: [scss],
  imports: [ComboboxModule, MatIconModule, CommonModule],
})
class ComboboxNoBoxLabelTestComponent extends ComboboxBaseTestComponent {}

describe('Single-select combobox with a default label / no boxLabel', () => {
  beforeEach(() => {
    cy.mount(ComboboxNoBoxLabelTestComponent);
  });
  it('textbox label is empty before there is a selection, and the selected value afterwards', () => {
    cy.get('.app-textbox-label').should('have.text', '');
    cy.get('.app-textbox').click();
    cy.get('.app-listbox-option').first().realClick();
    cy.get('.app-textbox-label').should('have.text', 'Apples');
    cy.get('.app-textbox').click();
    cy.get('.app-listbox-option').eq(1).realClick();
    cy.get('.app-textbox-label').should('have.text', 'Bananas');
  });
});

@Component({
  selector: 'app-combobox-default-label-multi-test',
  template: `
    <p class="outside-element"
      >Throwaway element to click on for outside combobox click</p
    >
    <p class="combobox-value">{{ value$ | async }}</p>
    <app-combobox class="fruits-dropdown">
      <app-combobox-label>
        <span>Select a fruit, A-E</span>
      </app-combobox-label>
      <app-textbox>
        <p boxLabel>Select a fruit</p>
        <span
          aria-hidden="true"
          class="material-symbols-outlined expand-more"
          boxIcon
        >
          expand_more
        </span>
      </app-textbox>
      <app-listbox [isMultiSelect]="true" (valueChanges)="onSelection($event)">
        @for (option of options; track option.id) {
          <app-listbox-option>{{ option.displayName }}</app-listbox-option>
        }
      </app-listbox>
    </app-combobox>
  `,
  encapsulation: ViewEncapsulation.None,
  styles: [scss],
  imports: [ComboboxModule, MatIconModule, CommonModule],
})
class ComboboxDynamicLabelMultiTestComponent extends ComboboxBaseTestComponent {}

describe('Multi-select combobox with a default (dynamic) label', () => {
  beforeEach(() => {
    cy.mount(ComboboxDynamicLabelMultiTestComponent);
  });
  it('textbox label shows the boxLabel before there is a selection, and the selected values afterwards', () => {
    cy.get('.app-textbox-label').should('have.text', 'Select a fruit');
    cy.get('.app-textbox').click();
    cy.get('.app-listbox-option').first().realClick();
    cy.get('.app-textbox-label').should('have.text', 'Apples');
    cy.get('.app-listbox-option').eq(1).realClick();
    cy.get('.app-textbox-label').should('have.text', 'Apples, Bananas');
    cy.get('.app-listbox-option').eq(1).realClick();
    cy.get('.app-textbox-label').should('have.text', 'Apples');
  });
});

@Component({
  selector: 'app-combobox-static-label-test',
  template: `
    <p class="outside-element"
      >Throwaway element to click on for outside combobox click</p
    >
    <p class="combobox-value">{{ value$ | async }}</p>
    <app-combobox class="fruits-dropdown">
      <app-combobox-label>
        <span>Fruits</span>
      </app-combobox-label>
      <app-textbox [dynamicLabel]="false">
        <p boxLabel>Select a fruit, A-E</p>
        <span
          aria-hidden="true"
          class="material-symbols-outlined expand-more"
          boxIcon
        >
          expand_more
        </span>
      </app-textbox>
      <app-listbox (valueChanges)="onSelection($event)">
        <app-listbox-label>
          <span>Select a fruit</span>
        </app-listbox-label>
        @for (option of options; track option.id) {
          <app-listbox-option>{{ option.displayName }}</app-listbox-option>
        }
      </app-listbox>
    </app-combobox>
  `,
  encapsulation: ViewEncapsulation.None,
  styles: [scss],
  imports: [ComboboxModule, MatIconModule, CommonModule],
})
class ComboboxStaticLabelTestComponent extends ComboboxBaseTestComponent {}

describe('Textbox with a static label', () => {
  beforeEach(() => {
    cy.mount(ComboboxStaticLabelTestComponent);
  });
  it('textbox label does not change with a selection', () => {
    cy.get('.app-textbox-label').should('have.text', 'Select a fruit, A-E');
    cy.get('.app-textbox').click();
    cy.get('.app-listbox-option').first().realClick();
    cy.get('.app-textbox-label').should('have.text', 'Select a fruit, A-E');
  });
});

@Component({
  selector: 'app-combobox-count-label-test',
  template: `
    <p class="outside-element"
      >Throwaway element to click on for outside combobox click</p
    >
    <p class="combobox-value">{{ value$ | async }}</p>
    <app-combobox class="fruits-dropdown">
      <app-combobox-label>
        <span>Select a fruit, A-E</span>
      </app-combobox-label>
      <app-textbox
        [selectedCountLabel]="{ plural: 'fruits', singular: 'fruit' }"
      >
        <p boxLabel>Select fruits</p>
        <span
          aria-hidden="true"
          class="material-symbols-outlined expand-more"
          boxIcon
        >
          expand_more
        </span>
      </app-textbox>
      <app-listbox [isMultiSelect]="true" (valueChanges)="onSelection($event)">
        <app-listbox-label>
          <span>Select fruits</span>
        </app-listbox-label>
        @for (option of options; track option.id) {
          <app-listbox-option>{{ option.displayName }}</app-listbox-option>
        }
      </app-listbox>
    </app-combobox>
  `,
  encapsulation: ViewEncapsulation.None,
  styles: [scss],
  imports: [ComboboxModule, MatIconModule, CommonModule],
})
class ComboboCountLabelMultiTestComponent extends ComboboxBaseTestComponent {}

describe('Multi-select combobox with a show selected count label', () => {
  beforeEach(() => {
    cy.mount(ComboboCountLabelMultiTestComponent);
  });
  it('textbox label shows the boxLabel before there is a selection, and a count of selected afterwards', () => {
    cy.get('.app-textbox-label').should('have.text', 'Select fruits');
    cy.get('.app-textbox').realClick();
    cy.get('.app-textbox-label').should('have.text', '0 fruits selected');
    cy.get('.app-listbox-option').eq(0).realClick();
    cy.get('.app-textbox-label').should('have.text', '1 fruit selected');
    cy.get('.app-listbox-option').eq(1).realClick();
    cy.get('.app-textbox-label').should('have.text', '2 fruits selected');
    cy.get('.app-listbox-option').eq(0).realClick();
    cy.get('.app-listbox-option').eq(1).realClick();
    cy.get('.app-textbox-label').should('have.text', '0 fruits selected');
  });
});

// Multi select combobox with dynamic label that uses groups
@Component({
  selector: 'app-combobox-grouped-multi-test',
  template: `
    <p class="outside-element"
      >Outside element to click on for outside combobox click</p
    >
    <p class="combobox-value">{{ value$ | async }}</p>
    <app-combobox class="fruits-dropdown">
      <app-combobox-label>
        <span>Select a fruit, A-E</span>
      </app-combobox-label>
      <app-textbox
        [selectedCountLabel]="{ singular: 'fruit', plural: 'fruits' }"
      >
        <p boxLabel>Select fruits</p>
        <span
          aria-hidden="true"
          class="material-symbols-outlined expand-more"
          boxIcon
        >
          expand_more
        </span>
      </app-textbox>
      <app-listbox [isMultiSelect]="true" (valueChanges)="onSelection($event)">
        <app-listbox-group>
          <app-listbox-label>
            <span>Group 1</span>
          </app-listbox-label>
          <app-listbox-option *ngFor="let option of options1">{{
            option.displayName
          }}</app-listbox-option>
        </app-listbox-group>
        <app-listbox-group>
          <app-listbox-label>
            <span>Group 2</span>
          </app-listbox-label>
          <app-listbox-option *ngFor="let option of options2">{{
            option.displayName
          }}</app-listbox-option>
        </app-listbox-group>
      </app-listbox>
    </app-combobox>
  `,
  encapsulation: ViewEncapsulation.None,
  styles: [scss],
  imports: [ComboboxModule, MatIconModule, CommonModule],
})
class ComboboxGroupedMultiTestComponent {
  options1 = [
    { displayName: 'Apples', id: 'appl' },
    { displayName: 'Bananas', id: 'bana' },
    { displayName: 'Coconuts', id: 'coco' },
  ];
  options2 = [
    { displayName: 'Durians', id: 'duri' },
    { displayName: 'Elderberries', id: 'elde' },
  ];
  value = new BehaviorSubject<any>(null);
  value$ = this.value.asObservable();

  onSelection(event: any): void {
    this.value.next(event);
  }
}

describe('Grouped multi-select combobox with a show selected count label', () => {
  beforeEach(() => {
    cy.mount(ComboboxGroupedMultiTestComponent);
  });

  it('can select from multiple groups', () => {
    cy.get('.app-textbox-label').should('have.text', 'Select fruits');
    cy.get('.app-textbox').click();
    cy.get('.app-textbox-label').should('have.text', '0 fruits selected');
    cy.get('.app-listbox-option').eq(0).realClick();
    cy.get('.app-listbox-option').eq(1).realClick();
    cy.get('.app-textbox-label').should('have.text', '2 fruits selected');
    cy.get('.app-listbox-option').eq(1).realClick();
    cy.get('.app-textbox-label').should('have.text', '1 fruit selected');
  });
});

@Component({
  selector: 'app-combobox-single-test',
  template: `
    <p class="outside-element"
      >Throwaway element to click on for outside combobox click</p
    >
    <p class="combobox-value">{{ value$ | async }}</p>
    <app-combobox class="fruits-dropdown">
      <app-combobox-label>
        <span>Select a fruit, A-E</span>
      </app-combobox-label>
      <app-textbox [customLabel]="customLabel">
        <p boxLabel>Select fruits</p>
        <span
          aria-hidden="true"
          class="material-symbols-outlined expand-more"
          boxIcon
        >
          expand_more
        </span>
      </app-textbox>
      <app-listbox [isMultiSelect]="true" (valueChanges)="onSelection($event)">
        <app-listbox-label>
          <span>Select fruits</span>
        </app-listbox-label>
        @for (option of options; track option.id) {
          <app-listbox-option>{{ option.displayName }}</app-listbox-option>
        }
      </app-listbox>
    </app-combobox>
  `,
  encapsulation: ViewEncapsulation.None,
  styles: [scss],
  imports: [ComboboxModule, MatIconModule, CommonModule],
})
class ComboboCustomLabelMultiTestComponent extends ComboboxBaseTestComponent {
  customLabel = (options: ListboxOptionComponent[]) => {
    if (options.length === 0) {
      return 'You need to select something';
    } else if (options.length === 1) {
      return `Only 1 fruit selected`;
    } else {
      return `Yay ${options.length} fruits selected`;
    }
  };
}

describe('Multi-select combobox with a custom label', () => {
  beforeEach(() => {
    cy.mount(ComboboCustomLabelMultiTestComponent);
  });
  it('textbox label shows the boxLabel before there is a selection, and a count of selected afterwards', () => {
    cy.get('.app-textbox-label').should('have.text', 'Select fruits');
    cy.get('.app-textbox').realClick();
    cy.get('.app-textbox-label').should(
      'have.text',
      'You need to select something'
    );
    cy.get('.app-listbox-option').first().realClick();
    cy.get('.app-textbox-label').should('have.text', 'Only 1 fruit selected');
    cy.get('.combobox-value').should('have.text', 'Apples');
    cy.get('.app-listbox-option').eq(1).realClick();
    cy.get('.app-textbox-label').should('have.text', 'Yay 2 fruits selected');
    cy.get('.combobox-value').should('have.text', 'Apples,Bananas');
    cy.get('.app-listbox-option').eq(0).realClick();
    cy.get('.app-listbox-option').eq(1).realClick();
    cy.get('.app-textbox-label').should(
      'have.text',
      'You need to select something'
    );
  });
});

@Component({
  selector: 'app-combobox-initial-selections-multi-test',
  template: `
    <p class="outside-element"
      >Throwaway element to click on for outside combobox click</p
    >
    <p class="combobox-value">{{ value$ | async }}</p>
    <app-combobox class="fruits-dropdown">
      <app-combobox-label>
        <span>Select a fruit, A-E</span>
      </app-combobox-label>
      <app-textbox>
        <p boxLabel>Select fruits</p>
        <span
          aria-hidden="true"
          class="material-symbols-outlined expand-more"
          boxIcon
        >
          expand_more
        </span>
      </app-textbox>
      <app-listbox [isMultiSelect]="true" (valueChanges)="onSelection($event)">
        <app-listbox-label>
          <span>Select fruits</span>
        </app-listbox-label>
        @for (option of options; track option.id; let i = $index) {
          <app-listbox-option [selected]="i === 2 || i === 4">{{
            option.displayName
          }}</app-listbox-option>
        }
      </app-listbox>
    </app-combobox>
  `,
  encapsulation: ViewEncapsulation.None,
  styles: [scss],
  imports: [ComboboxModule, MatIconModule, CommonModule],
})
class ComboboInitialSelectionsMultiTestComponent extends ComboboxBaseTestComponent {}

describe('Multi-select combobox with a dynamic label and initial selections', () => {
  beforeEach(() => {
    cy.mount(ComboboInitialSelectionsMultiTestComponent);
  });
  it('textbox label shows the boxLabel before there is a selection, and a count of selected afterwards', () => {
    cy.get('.app-textbox-label').should('have.text', 'Coconuts, Elderberries');
    cy.get('.app-textbox').click();
    cy.get('.app-textbox-label').should('have.text', 'Coconuts, Elderberries');
    cy.get('.app-listbox-option').eq(2).realClick();
    cy.get('.app-textbox-label').should('have.text', 'Elderberries');
  });
});

@Component({
  selector: 'app-combobox-initial-selections-multi-count-test',
  template: `
    <p class="outside-element"
      >Throwaway element to click on for outside combobox click</p
    >
    <p class="combobox-value">{{ value$ | async }}</p>
    <app-combobox class="fruits-dropdown">
      <app-combobox-label>
        <span>Select a fruit, A-E</span>
      </app-combobox-label>
      <app-textbox
        [selectedCountLabel]="{ plural: 'fruits', singular: 'fruit' }"
      >
        <p boxLabel>Select fruits</p>
        <span
          aria-hidden="true"
          class="material-symbols-outlined expand-more"
          boxIcon
        >
          expand_more
        </span>
      </app-textbox>
      <app-listbox [isMultiSelect]="true" (valueChanges)="onSelection($event)">
        <app-listbox-label>
          <span>Select fruits</span>
        </app-listbox-label>
        @for (option of options; track option.id; let i = $index) {
          <app-listbox-option [selected]="i === 2 || i === 4">{{
            option.displayName
          }}</app-listbox-option>
        }
      </app-listbox>
    </app-combobox>
  `,
  encapsulation: ViewEncapsulation.None,
  styles: [scss],
  imports: [ComboboxModule, MatIconModule, CommonModule],
})
class ComboboInitialSelectionsCountMultiTestComponent extends ComboboxBaseTestComponent {}

describe('Multi-select combobox with a count label and initial selections', () => {
  beforeEach(() => {
    cy.mount(ComboboInitialSelectionsCountMultiTestComponent);
  });
  it('textbox label shows the boxLabel before there is a selection, and a count of selected afterwards', () => {
    cy.get('.app-textbox-label').should('have.text', '2 fruits selected');
    cy.get('.app-textbox').click();
    cy.get('.app-textbox-label').should('have.text', '2 fruits selected');
    cy.get('.app-listbox-option').eq(2).realClick();
    cy.get('.app-textbox-label').should('have.text', '1 fruit selected');
  });
});
