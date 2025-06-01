/* eslint-disable @angular-eslint/prefer-standalone */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import 'cypress-real-events';
import { beforeEach, cy, describe, it } from 'local-cypress';
import { BehaviorSubject } from 'rxjs';
import { ComboboxModule } from '../combobox.module';
import { ComboboxService } from '../combobox.service';
import { ComboboxBaseTestComponent, scss } from './combobox-testing.constants';

@Component({
  selector: 'app-combobox-simple-multi-test',
  template: `
    <p class="outside-element"
      >Outside element to click on for outside combobox click</p
    >
    <app-combobox class="fruits-dropdown">
      <app-combobox-label>
        <span>Fruits</span>
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
      <app-listbox [isMultiSelect]="true" (valueChanges)="onSelection($event)">
        <app-listbox-label>
          <span>Select a fruit</span>
        </app-listbox-label>
        <app-listbox-option *ngFor="let option of options"
          ><span
            aria-hidden="true"
            class="material-symbols-outlined icon checkbox"
            selectedIcon
          >
            check_box
          </span>
          <span
            unselectedIcon
            aria-hidden="true"
            class="material-symbols-outlined icon checkbox"
          >
            check_box_outline_blank </span
          >{{ option.displayName }}</app-listbox-option
        >
      </app-listbox>
    </app-combobox>
    <p class="combobox-value">{{ value$ | async }}</p>
  `,
  encapsulation: ViewEncapsulation.None,
  styles: [scss],
  imports: [ComboboxModule, MatIconModule, CommonModule],
})
class ComboboxSimpleMultiSelectTestComponent extends ComboboxBaseTestComponent {}

describe('Default multi-select combobox', () => {
  beforeEach(() => {
    cy.mount(ComboboxSimpleMultiSelectTestComponent);
  });
  it('the current class is on the first selected option if there is one or on the 0th option once opened', () => {
    cy.get('.textbox').realClick();
    cy.get('.listbox-option').first().should('have.class', 'current');
    cy.get('.textbox').type('{esc}');
    cy.get('.listbox').should('not.be.visible');
    cy.get('.textbox').realClick();
    cy.get('.listbox-option').eq(2).realClick();
    cy.get('.listbox-option').eq(2).should('have.class', 'selected');
    cy.get('.listbox-option').eq(2).should('have.class', 'current');
    cy.get('.textbox').type('{esc}');
    cy.get('.textbox').realClick();
    cy.get('.listbox-option').eq(2).should('have.class', 'current');
    cy.get('.listbox-option').eq(2).realClick();
    cy.get('.textbox').type('{esc}');
    cy.get('.textbox').realClick();
    cy.get('.listbox-option').eq(0).should('have.class', 'current');
    cy.get('.listbox-option').eq(2).realClick();
    cy.get('.listbox-option').eq(3).realClick();
    cy.get('.listbox-option').eq(3).should('have.class', 'current');
    cy.get('.textbox').type('{esc}');
    cy.get('.textbox').realClick();
    cy.get('.listbox-option').eq(2).should('have.class', 'current');
  });
});

// Multi select combobox with dropdown options that get
// updated by interacting with outside button components
@Component({
  selector: 'app-combobox-external-label-change',
  template: `
    <p class="outside-element"
      >Outside element to click on for outside combobox click</p
    >
    <button (click)="disableApple()" class="disable-apple"
      >Disable apple, select banana</button
    >
    <button (click)="enableApple()" class="enable-apple-button"
      >Enable apple</button
    >
    <button (click)="selectCoconut()" class="select-coconut-button"
      >Select coconut</button
    >
    <button (click)="deselectCoconut()" class="deselect-coconut-button"
      >Deelect coconut</button
    >
    <button (click)="clearValue()" class="clear-value-button"
      >Clear value</button
    >
    <p class="combobox-value">{{ value$ | async }}</p>
    <app-combobox class="fruits-dropdown">
      <app-combobox-label>
        <span>Fruits</span>
      </app-combobox-label>
      <app-textbox
        [selectedCountLabel]="{ singular: 'fruit', plural: 'fruits' }"
      >
        <p boxLabel>Select a fruit, A-E</p>
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
          <span>Select a fruit</span>
        </app-listbox-label>
        @for (option of options; track option.id) {
          <app-listbox-option
            [selected]="(selected$ | async).includes(option.displayName)"
            [disabled]="(disabled$ | async).includes(option.displayName)"
            >{{ option.displayName }}</app-listbox-option
          >
        }
      </app-listbox>
    </app-combobox>
  `,
  encapsulation: ViewEncapsulation.None,
  styles: [scss],
  imports: [ComboboxModule, MatIconModule, CommonModule],
  providers: [ComboboxService],
})
class ComboboxExternalLabelChangeTestComponent {
  options = [
    { displayName: 'Apples', id: 'appl' },
    { displayName: 'Bananas', id: 'bana' },
    { displayName: 'Coconuts', id: 'coco' },
    { displayName: 'Durians', id: 'duri' },
    {
      displayName: 'Elderberries',
      id: 'elde',
    },
  ];
  selected = new BehaviorSubject<string[]>([]);
  selected$ = this.selected.asObservable();
  disabled = new BehaviorSubject<string[]>([]);
  disabled$ = this.disabled.asObservable();
  value = new BehaviorSubject<any>('Apples');
  value$ = this.value.asObservable();

  onSelection(event: string[]): void {
    this.value.next(event);
    this.selected.next(event);
  }

  disableApple() {
    this.addToArray(0, 'disabled');
  }

  enableApple() {
    this.removeFromArray(0, 'disabled');
  }

  selectCoconut() {
    this.addToArray(2, 'selected');
  }

  deselectCoconut() {
    this.removeFromArray(2, 'selected');
  }

  addToArray(i: number, array: 'selected' | 'disabled'): void {
    const curr = this[array].value;
    if (!curr.includes(this.options[i].displayName)) {
      this[array].next([...curr, this.options[i].displayName]);
    }
  }

  removeFromArray(i: number, array: 'selected' | 'disabled'): void {
    this[array].next(
      this[array].value.filter((x) => x !== this.options[i].displayName)
    );
  }

  clearValue() {
    this.value.next('');
  }
}

describe('ComboboxExternalLabelChangeTestComponent', () => {
  beforeEach(() => {
    cy.mount(ComboboxExternalLabelChangeTestComponent);
  });

  it('the textbox has the correct label and it changes with change in input selected property', () => {
    cy.get('.textbox-label').should('have.text', 'Select a fruit, A-E');
    cy.get('.textbox').click();
    cy.get('.listbox-option').eq(0).realClick();
    cy.get('.textbox-label').should('have.text', '1 fruit selected');
    cy.get('.select-coconut-button').realClick();
    cy.get('.textbox-label').should('have.text', '2 fruits selected');
    cy.get('.deselect-coconut-button').realClick();
    cy.get('.textbox-label').should('have.text', '1 fruit selected');
  });

  it('the combobox should not emit with external change in input selected property', () => {
    cy.get('.textbox').click();
    cy.get('.listbox-option').eq(0).realClick();
    cy.get('.combobox-value').should('have.text', 'Apples');
    cy.get('.select-coconut-button').click();
    cy.get('.combobox-value').should('have.text', 'Apples');
  });

  it('the combobox should emit with clicking on options', () => {
    cy.get('.textbox').click();
    cy.get('.listbox-option').eq(0).realClick();
    cy.get('.combobox-value').should('have.text', 'Apples');
    cy.get('.listbox-option').eq(1).realClick();
    cy.get('.listbox-option').eq(2).realClick();
    cy.get('.listbox-option').eq(3).realClick();
    cy.get('.listbox-option').eq(4).realClick();
    cy.get('.combobox-value').should(
      'have.text',
      'Apples,Bananas,Coconuts,Durians,Elderberries'
    );
    cy.get('.textbox-label').should('have.text', '5 fruits selected');
  });

  it('combobox should emit the correct selection if there is a click after the selection status is changed programmatically', () => {
    cy.get('.textbox').click();
    cy.get('.listbox-option').eq(0).realClick();
    cy.get('.textbox-label').should('have.text', '1 fruit selected');
    cy.get('.select-coconut-button').click();
    cy.get('.textbox').click();
    cy.get('.listbox-option').eq(1).realClick();
    cy.get('.listbox-option').eq(3).realClick();
    cy.get('.combobox-value').should(
      'have.text',
      'Apples,Bananas,Coconuts,Durians'
    );
  });

  it('combobox should emit correctly if there is a click after the selection status is changed programmatically and the new value is the same as the old', () => {
    cy.get('.textbox').click();
    cy.get('.listbox-option').eq(0).realClick();
    cy.get('.textbox-label').should('have.text', '1 fruit selected');
    cy.get('.select-coconut-button').realClick();
    cy.get('.combobox-value').should('have.text', 'Apples');
    cy.get('.clear-value-button').click();
    cy.get('.combobox-value').should('have.text', '');
    cy.get('.textbox').click();
    cy.get('.listbox-option').eq(2).realClick();
    cy.get('.combobox-value').should('have.text', 'Apples');
  });
});

// Multi select combobox with some disabled options
@Component({
  selector: 'app-combobox-multi-disabled-options-test',
  template: `
    <p class="outside-element"
      >Throwaway element to click on for outside combobox click</p
    >
    <button (click)="selectCoconut()" class="select-coconut-button"
      >Select coconut</button
    >
    <button (click)="deselectCoconut()" class="deselect-coconut-button"
      >Deelect coconut</button
    >
    <app-combobox class="fruits-dropdown">
      <app-combobox-label>
        <span>Fruits</span>
      </app-combobox-label>
      <app-textbox [useListboxLabelAsBoxPlaceholder]="true">
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
          <span>Select a fruit</span>
        </app-listbox-label>
        <app-listbox-option
          *ngFor="let option of options"
          [disabled]="option.displayName.length > 7"
          >{{ option.displayName }}</app-listbox-option
        >
      </app-listbox>
    </app-combobox>
    <p class="combobox-value">{{ value$ | async }}</p>
  `,
  encapsulation: ViewEncapsulation.None,
  styles: [scss],
  imports: [ComboboxModule, MatIconModule, CommonModule],
})
class ComboboxMultiSelectDisabledOptionsComponent extends ComboboxBaseTestComponent {
  selected = new BehaviorSubject<string[]>([]);
  selected$ = this.selected.asObservable();

  selectCoconut() {
    this.addToArray(2, 'selected');
  }

  addToArray(i: number, array: 'selected' | 'disabled'): void {
    const curr = this[array].value;
    if (!curr.includes(this.options[i].displayName)) {
      this[array].next([...curr, this.options[i].displayName]);
    }
  }
}

describe('ComboboxMultiSelectDisabledOptionsComponent', () => {
  beforeEach(() => {
    cy.mount(ComboboxMultiSelectDisabledOptionsComponent);
  });
  it('can select non-disabled options', () => {
    cy.get('.textbox').click();
    cy.get('.listbox-option').eq(0).realClick();
    cy.get('.listbox-option').eq(1).realClick();
    cy.get('.combobox-value').should('have.text', 'Apples,Bananas');
  });
  it('cannot select disabled options / disabled options have correct class', () => {
    cy.get('.textbox').click();
    cy.get('.listbox-option').eq(2).should('have.class', 'disabled');
    cy.get('.listbox-option').eq(4).should('have.class', 'disabled');
    cy.get('.listbox-option').eq(2).realClick();
    cy.get('.listbox-option').eq(4).realClick();
    cy.get('.listbox-option').eq(2).should('not.have.class', 'selected');
    cy.get('.listbox-option').eq(4).should('not.have.class', 'selected');
    cy.get('.combobox-value').should('not.have.text', 'Coconuts,Elderberries');
  });
  it('cannot change selected property of disabled options from the outside', () => {
    cy.get('.textbox').click();
    cy.get('.listbox-option').eq(2).should('have.class', 'disabled');
    cy.get('.select-coconut-button').click();
    cy.get('.listbox-option').eq(2).should('not.have.class', 'selected');
    cy.get('.combobox-value').should('not.have.text', 'Coconuts');
  });
});

@Component({
  selector: 'app-ng-form-listbox-multi-test',
  template: `
    <p class="display-control-values">{{ control.value.join(', ') }}</p>
    <app-combobox class="fruits-dropdown">
      <app-combobox-label>
        <span>Fruits</span>
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
      <app-listbox [ngFormControl]="control" [isMultiSelect]="true">
        <app-listbox-label>
          <span>Select a fruit</span>
        </app-listbox-label>
        @for (option of options; track option.id) {
          <app-listbox-option
            [selected]="control.value.includes(option.id)"
            [value]="option.id"
            >{{ option.displayName }}</app-listbox-option
          >
        }
      </app-listbox>
    </app-combobox>
    <button (click)="setSelectAll()" class="super-cool-button-pls-click-me"
      >Set all selected</button
    >
  `,
  encapsulation: ViewEncapsulation.None,
  styles: [scss],
  imports: [ComboboxModule, MatIconModule, CommonModule],
})
class NgFormListboxMultiTestComponent implements OnInit {
  options = [
    { displayName: 'Apples', id: 'appl' },
    { displayName: 'Bananas', id: 'bana' },
    { displayName: 'Coconuts', id: 'coco' },
    { displayName: 'Durians', id: 'duri' },
    { displayName: 'Elderberries', id: 'elde' },
  ];
  control: FormControl<string[]>;

  ngOnInit(): void {
    this.control = new FormControl([]);
  }

  setSelectAll() {
    this.control.setValue(this.options.map((x) => x.id));
  }
}

describe('NgFormListboxMultiTestComponent', () => {
  beforeEach(() => {
    cy.mount(NgFormListboxMultiTestComponent);
  });
  it('can make more than one selection', () => {
    cy.get('.textbox').click();
    cy.get('.listbox-option').first().realClick();
    cy.get('.listbox-option').eq(1).realClick();
    cy.get('.textbox-label').should('have.text', 'Apples, Bananas');
    cy.get('.listbox-option').first().should('have.class', 'selected');
    cy.get('.listbox-option').eq(1).should('have.class', 'selected');
  });
  it('can unselect selections', () => {
    cy.get('.textbox').click();
    cy.get('.listbox-option').first().realClick();
    cy.get('.listbox-option').eq(1).realClick();
    cy.get('.textbox-label').should('have.text', 'Apples, Bananas');
    cy.get('.listbox-option').first().realClick();
    cy.get('.textbox-label').should('have.text', 'Bananas');
    cy.get('.listbox-option').eq(1).realClick();
    cy.get('.textbox-label').should('have.text', 'Select a fruit, A-E');
    cy.get('.listbox-option').first().should('not.have.class', 'selected');
    cy.get('.listbox-option').eq(1).should('not.have.class', 'selected');
  });
  it('clicking outside the combobox should close the listbox', () => {
    cy.get('.textbox').click();
    cy.get('.listbox-option').first().realClick();
    cy.get('.listbox').should('be.visible');
    cy.get('.display-control-values').realClick();
    cy.get('.listbox').should('not.be.visible');
  });
  it('should have correct control values', () => {
    cy.get('.textbox').click();
    cy.get('.listbox-option').first().realClick();
    cy.get('.listbox-option').eq(1).realClick();
    cy.get('.display-control-values').realClick();
    cy.get('.display-control-values').should('have.text', 'appl, bana');
  });
});
