/* eslint-disable @angular-eslint/prefer-standalone */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { CommonModule } from '@angular/common';
import { Component, ViewEncapsulation } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import 'cypress-real-events';
import { beforeEach, cy, describe, it } from 'local-cypress';
import { BehaviorSubject } from 'rxjs';
import { ComboboxModule } from '../combobox.module';
import { ComboboxBaseTestComponent, scss } from './combobox-testing.constants';

// Simple single select combobox that displays selected
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
      <app-textbox class="textbox">
        <span boxLabel>Select a fruit</span>
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
class ComboboxSingleTestComponent extends ComboboxBaseTestComponent {}

describe('ComboboxSingleSelectOnlyComponent', () => {
  beforeEach(() => {
    cy.mount(ComboboxSingleTestComponent);
  });
  describe('click behavior after load', () => {
    it('should not emit a value on load', () => {
      cy.get('.combobox-value').should('have.text', '');
    });
    it('listbox should not be visible on load', () => {
      cy.get('.listbox').should('not.be.visible');
    });
    it('should open the combobox on click', () => {
      cy.get('.textbox').click();
      cy.get('.listbox').should('be.visible');
    });
    it('should emit the correct value on option click', () => {
      cy.get('.textbox').click();
      cy.get('.listbox-option').first().realClick();
      cy.get('.combobox-value').should('have.text', 'Apples');
    });
    it('should display value on textbox', () => {
      cy.get('.textbox').click();
      cy.get('.listbox-option').first().realClick();
      cy.get('.textbox-label').should('include.text', 'Apples');
      cy.get('.textbox').click();
      cy.get('.listbox-option').eq(1).realClick();
      cy.get('.textbox-label').should('include.text', 'Bananas');
      cy.get('.textbox-label').should('not.include.text', 'Apples');
    });
    it('listbox should close on option click', () => {
      cy.get('.textbox').click();
      cy.get('.listbox-option').first().click();
      cy.get('.listbox').should('not.be.visible');
    });
    it('selected option should be highlighted on listbox reopen', () => {
      cy.get('.textbox').realClick();
      cy.get('.listbox-option').first().realClick();
      cy.get('.textbox').realClick();
      cy.get('.listbox-option').first().should('have.class', 'current');
    });
    it('clicking outside the combobox should close the listbox', () => {
      cy.get('.textbox').realClick();
      cy.get('.listbox').should('be.visible');
      cy.get('.outside-element').realClick();
      cy.get('.listbox').should('not.be.visible');
    });
  });

  it('the current class is on the first selected option if there is one or on the 0th option when opened', () => {
    cy.get('.textbox').realClick();
    cy.get('.listbox-option').first().should('have.class', 'current');
    cy.get('.textbox').type('{esc}');
    cy.get('.listbox').should('not.be.visible');
    cy.get('.textbox').realClick();
    cy.get('.listbox-option').eq(2).realClick();
    cy.get('.textbox').realClick();
    cy.get('.listbox-option').eq(2).should('have.class', 'selected');
    cy.get('.listbox-option').eq(2).should('have.class', 'current');
    cy.get('.textbox').type('{esc}');
    cy.get('.textbox').realClick();
    cy.get('.listbox-option').eq(2).should('have.class', 'current');
    cy.get('.listbox-option').eq(3).realClick();
    cy.get('.textbox').realClick();
    cy.get('.listbox-option').eq(3).should('have.class', 'selected');
    cy.get('.listbox-option').eq(3).should('have.class', 'current');
  });
});

// Single select combobox with some disabled options
@Component({
  selector: 'app-combobox-single-disabled-options-test',
  template: `
    <p class="outside-element"
      >Throwaway element to click on for outside combobox click</p
    >
    <p class="combobox-value">{{ value$ | async }}</p>
    <app-combobox class="fruits-dropdown">
      <app-combobox-label>
        <span>Fruits</span>
      </app-combobox-label>
      <app-textbox>
        <span boxLabel>Select a fruit</span>
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
          <app-listbox-option [disabled]="option.displayName.length > 7">{{
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
class ComboboxSingleSelectDisabledOptionsComponent extends ComboboxBaseTestComponent {}

describe('ComboboxSingleSelectDisabledOptionsComponent', () => {
  beforeEach(() => {
    cy.mount(ComboboxSingleSelectDisabledOptionsComponent);
  });
  it('can select non-disabled options', () => {
    cy.get('.textbox').click();
    cy.get('.listbox-option').first().realClick();
    cy.get('.combobox-value').should('have.text', 'Apples');
  });
  it('cannot select disabled options', () => {
    cy.get('.textbox').click();
    cy.get('.listbox-option').eq(4).realClick();
    cy.get('.combobox-value').should('not.have.text', 'Elderberries');
  });
});

// Single select combobox with a pre-set selected option
@Component({
  selector: 'app-combobox-select-from-outside-single-test',
  template: `
    <p class="outside-element"
      >Outside element to click on for outside combobox click</p
    >
    <p class="combobox-value">{{ value$ | async }}</p>
    <app-combobox class="fruits-dropdown">
      <app-combobox-label>
        <span>Fruits</span>
      </app-combobox-label>
      <app-textbox>
        <span boxLabel>Select a fruit</span>
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
          <app-listbox-option [selected]="option.displayName === 'Coconuts'">{{
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
class ComboboxSelectFromOutsideSingleTestComponent extends ComboboxBaseTestComponent {}

describe('ComboboxSelectFromOutsideSingleComponent', () => {
  beforeEach(() => {
    cy.mount(ComboboxSelectFromOutsideSingleTestComponent);
  });
  it('should display the selected option in the textbox on load', () => {
    cy.wait(1000);
    cy.get('.textbox-label').should('have.text', 'Coconuts');
  });
  it('can switch the selected option on click', () => {
    cy.get('.textbox').click();
    cy.get('.listbox-option').first().realClick();
    cy.get('.combobox-value').should('have.text', 'Apples');
  });
});

// Single select combobox with groups
@Component({
  selector: 'app-combobox-grouped-single-test',
  template: `
    <app-combobox class="pixar-movies-dropdown">
      <app-combobox-label>
        <span>Star Wars Movies Combobox</span>
      </app-combobox-label>
      <app-textbox class="textbox">
        <p boxLabel
          >This combobox stores your favorite of the first 6 Star Wars
          movies!</p
        >
        <span
          aria-hidden="true"
          class="material-symbols-outlined expand-more"
          boxIcon
        >
          expand_more
        </span>
      </app-textbox>
      <app-listbox (valueChanges)="onSelection($event)">
        <app-listbox-group>
          <app-listbox-label>
            <span class="group-label">Original Trilogy</span>
          </app-listbox-label>
          <app-listbox-option
            *ngFor="let option of optionsGroup1"
            [value]="option.id"
            >{{ option.displayName }}</app-listbox-option
          >
        </app-listbox-group>
        <app-listbox-group>
          <app-listbox-label>
            <span class="group-label">Prequel Trilogy</span>
          </app-listbox-label>
          <app-listbox-option
            *ngFor="let option of optionsGroup2"
            [value]="option.id"
            >{{ option.displayName }}</app-listbox-option
          >
        </app-listbox-group>
      </app-listbox>
    </app-combobox>
    <p class="combobox-value">Selected id value: {{ selected$ | async }}</p>
  `,
  encapsulation: ViewEncapsulation.None,
  styles: [scss],
  imports: [ComboboxModule, MatIconModule, CommonModule],
})
class ComboboxGroupedSingleTestComponent {
  optionsGroup1 = [
    { displayName: 'A New Hope', id: 'newHope' },
    { displayName: 'The Empire Strikes Back', id: 'empire' },
    { displayName: 'Return of the Jedi', id: 'returnJedi' },
  ];
  optionsGroup2 = [
    { displayName: 'The Phantom Menace', id: 'phantom' },
    { displayName: 'Attack of the Clones', id: 'clones' },
    { displayName: 'Revenge of the Sith', id: 'sith' },
  ];
  value = new BehaviorSubject<any>(null);
  value$ = this.value.asObservable();

  onSelection(selectedId: string): void {
    this.value.next(selectedId);
  }
}

describe('ComboboxGroupedSingleTestComponent', () => {
  beforeEach(() => {
    cy.mount(ComboboxGroupedSingleTestComponent);
  });
  it('can select values from different groups', () => {
    cy.get('.textbox').realClick();
    cy.get('.listbox-option').first().realClick();
    cy.get('.textbox-label').should('include.text', 'A New Hope');
    cy.get('.textbox').click();
    cy.get('.listbox-option').eq(4).realClick();
    cy.get('.textbox-label').should('include.text', 'Attack of the Clones');
    cy.get('.textbox-label').should('not.include.text', 'A New Hope');
  });
});

@Component({
  selector: 'app-ng-form-listbox-single-test',
  template: `
    <p class="display-control-value">{{ control.valueChanges | async }}</p>
    <app-combobox class="fruits-dropdown">
      <app-combobox-label>
        <span>Select a fruit</span>
      </app-combobox-label>
      <app-textbox>
        <p boxLabel>Select a fruit, A-E</p>
        <span
          aria-hidden="true"
          class="material-symbols-outlined expand-more"
          boxIcon
        >
          expand_more
        </span>
      </app-textbox>
      <app-listbox [ngFormControl]="control">
        <app-listbox-label>
          <span>Select a fruit</span>
        </app-listbox-label>
        @for (option of options; track option.id) {
          <app-listbox-option
            [selected]="control.value === option.id"
            [value]="option.id"
            >{{ option.displayName }}</app-listbox-option
          >
        }
      </app-listbox>
    </app-combobox>
  `,
  encapsulation: ViewEncapsulation.None,
  styles: [scss],
  imports: [ComboboxModule, MatIconModule, CommonModule],
})
class NgFormListboxSingleTestComponent {
  options = [
    { displayName: 'Apples', id: 'appl' },
    { displayName: 'Bananas', id: 'bana' },
    { displayName: 'Coconuts', id: 'coco' },
    { displayName: 'Durians', id: 'duri' },
    { displayName: 'Elderberries', id: 'elde' },
  ];
  control: FormControl<any> = new FormControl(null);
}

describe('NgFormListboxSingleTestComponent', () => {
  beforeEach(() => {
    cy.mount(NgFormListboxSingleTestComponent);
  });
  it('can make one selection', () => {
    cy.get('.textbox').click();
    cy.get('.listbox-option').eq(1).realClick();
    cy.get('.textbox-label').should('have.text', 'Bananas');
    cy.get('.listbox-option').eq(1).should('have.class', 'selected');
  });
  it('can change selection', () => {
    cy.get('.textbox').click();
    cy.get('.listbox-option').eq(1).realClick();
    cy.get('.textbox-label').should('have.text', 'Bananas');
    cy.get('.textbox').click();
    cy.get('.listbox-option').first().realClick();
    cy.get('.textbox-label').should('have.text', 'Apples');
    cy.get('.listbox-option').first().should('have.class', 'selected');
    cy.get('.listbox-option').eq(1).should('not.have.class', 'selected');
  });
  it('selecting option should close the listbox', () => {
    cy.get('.textbox').click();
    cy.get('.listbox-option').first().realClick();
    cy.get('.listbox').should('not.be.visible');
  });
  it('control value should match selected combobox value', () => {
    cy.get('.textbox').click();
    cy.get('.listbox-option').eq(1).realClick();
    cy.get('.display-control-value').should('have.text', 'bana');
  });
});
