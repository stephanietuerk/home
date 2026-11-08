/* eslint-disable @angular-eslint/prefer-standalone */
import { CommonModule } from '@angular/common';
import { Component, ViewEncapsulation } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import 'cypress-real-events';
import { beforeEach, cy, describe, it } from 'local-cypress';
import { ComboboxModule } from '../combobox.module';
import { ComboboxBaseTestComponent, scss } from './combobox-testing.constants';

@Component({
  selector: 'app-combobox-single-test',
  template: `
    <p class="outside-element"
      >Throwaway element to click on for outside combobox click</p
    >
    <p class="combobox-value">{{ value$ | async }}</p>
    <app-combobox class="fruits-dropdown">
      <app-combobox-label>
        <span>Fruits</span>
      </app-combobox-label>
      <app-textbox class="textbox" [useListboxLabelAsBoxPlaceholder]="true">
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
class ComboboxSingleKeyboardTestComponent extends ComboboxBaseTestComponent {}

describe('keyboard navigation with a generic listbox', () => {
  beforeEach(() => {
    cy.mount(ComboboxSingleKeyboardTestComponent);
    cy.get('.textbox').trigger('focus');
  });
  describe('correctly opens the combobox with the open keys ', () => {
    it('opens the listbox on enter and first option is current, then arrows through', () => {
      cy.get('.textbox').trigger('keydown', { key: 'Enter' });
      cy.get('.listbox').should('be.visible');
      cy.get('.listbox-option').first().should('have.class', 'current');
    });
    it('opens the listbox on space', () => {
      cy.get('.textbox').trigger('keydown', { key: ' ' });
      cy.get('.listbox').should('be.visible');
    });
    it('opens the listbox on down arrow', () => {
      cy.get('.textbox').trigger('keydown', { key: 'ArrowDown' });
      cy.get('.listbox').should('be.visible');
    });
    it('opens the listbox on up arrow', () => {
      cy.get('.textbox').trigger('keydown', { key: 'ArrowUp' });
      cy.get('.listbox').should('be.visible');
    });
  });
});

describe('keyboard navigation with a single select listbox', () => {
  beforeEach(() => {
    cy.mount(ComboboxSingleKeyboardTestComponent);
  });
  it('correctly responds to keyboard navigation and selection', () => {
    cy.get('.textbox').should('be.visible');
    cy.get('.textbox-container').focus();
    // opens the combobox on enter
    cy.get('.textbox').type('{enter}');
    cy.get('.listbox').should('be.visible');
    // applies current class to first option on enter
    cy.get('.listbox-option').first().should('have.class', 'current');
    // closes the combobox with escape
    cy.get('.textbox').type('{esc}');
    cy.get('.listbox').should('not.be.visible');
    // applies current class to first option on down arrow
    cy.get('.textbox-container').focus();
    cy.get('.textbox').type('{downArrow}');
    cy.get('.listbox-option').first().should('have.class', 'current');
    // selects an option using the keyboard and updates the value
    cy.get('.textbox').type('{downarrow}{enter}');
    cy.get('.combobox-value').should('have.text', 'Bananas');
    // focus remains on first option when up arrow is presse
    cy.get('.textbox-container').focus();
    cy.get('.textbox').type('{enter}');
    cy.get('.listbox-option').eq(1).should('have.class', 'current');
    cy.get('.textbox').type('{upArrow}');
    cy.get('.listbox-option').first().should('have.class', 'current');
    cy.get('.textbox').type('{upArrow}');
    cy.get('.listbox-option').first().should('have.class', 'current');
    // focus remains on last option when down arrow is pressed
    cy.get('.textbox').type('{esc}');
    cy.get('.textbox-container').focus();
    cy.get('.textbox').type('{downArrow}{downArrow}{downArrow}{downArrow}');
    cy.get('.listbox-option').eq(4).should('have.class', 'current');
    cy.get('.textbox').type('{downArrow}');
    cy.get('.listbox-option').eq(4).should('have.class', 'current');
  });
});

@Component({
  selector: 'app-combobox-multi-test',
  template: `
    <p class="outside-element"
      >Throwaway element to click on for outside combobox click</p
    >
    <p class="combobox-value">{{ value$ | async }}</p>
    <app-combobox class="fruits-dropdown">
      <app-combobox-label>
        <span>Fruits</span>
      </app-combobox-label>
      <app-textbox class="textbox" [useListboxLabelAsBoxPlaceholder]="true">
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
          <app-listbox-option>{{ option.displayName }}</app-listbox-option>
        }
      </app-listbox>
    </app-combobox>
  `,
  encapsulation: ViewEncapsulation.None,
  styles: [scss],
  imports: [ComboboxModule, MatIconModule, CommonModule],
})
class ComboboxMultiKeyboardTestComponent extends ComboboxBaseTestComponent {}

describe('keyboard navigation with a multi select listbox', () => {
  beforeEach(() => {
    cy.mount(ComboboxMultiKeyboardTestComponent);
  });
  it('correctly responds to keyboard navigation and selection', () => {
    // textbox receives focus on tab
    cy.realPress('Tab');
    cy.get('.textbox-container').should('be.focused');
    // opens the combobox on enter
    cy.get('.textbox').type('{enter}');
    cy.get('.listbox').should('be.visible');
    // apllies current class to first option on enter
    cy.get('.listbox-option').first().should('have.class', 'current');
    // closes the combobox with escape
    cy.get('.textbox').type('{esc}');
    cy.get('.listbox').should('not.be.visible');
    // applies current class to first option on down arrow
    cy.get('.textbox-container').focus();
    cy.get('.textbox').type('{downArrow}');
    cy.get('.listbox-option').first().should('have.class', 'current');
    // selects and unselects options using the keyboard and updates the value
    cy.get('.textbox').type('{downarrow}{enter}');
    cy.get('.textbox').type('{downarrow}{downarrow}{enter}');
    cy.get('.combobox-value').should('have.text', 'Bananas,Durians');
    cy.get('.textbox').type('{enter}');
    cy.get('.combobox-value').should('have.text', 'Bananas');
    // focus remains on first option when up arrow is presse
    cy.get('.textbox').type('{upArrow}{upArrow}{upArrow}');
    cy.get('.listbox-option').first().should('have.class', 'current');
    cy.get('.textbox').type('{upArrow}');
    cy.get('.listbox-option').first().should('have.class', 'current');
    // focus remains on last option when down arrow is pressed
    cy.get('.textbox').type(
      '{enter}{downArrow}{downArrow}{downArrow}{downArrow}'
    );
    cy.get('.listbox-option').eq(4).should('have.class', 'current');
    cy.get('.textbox').type('{downArrow}');
    cy.get('.listbox-option').eq(4).should('have.class', 'current');
  });
});
