import { NgModule } from '@angular/core';
import { ProjectNavbarComponent } from '../projects/project-navbar/project-navbar.component';
import { CheckboxGroupComponent } from './components/checkbox-group/checkbox-group.component';
import { CheckboxInputComponent } from './components/checkbox-input/checkbox-input.component';
import { RadioGroupComponent } from './components/radio-group/radio-group.component';
import { RadioInputComponent } from './components/radio-input/radio-input.component';
import { SortArrowsComponent } from './components/sort-arrows/sort-arrows.component';
import { SvgDefinitionsComponent } from './components/svg-icon-old/svg-definitions.component';
import { SvgIconOldComponent } from './components/svg-icon-old/svg-icon-old.component';
import { TableComponent } from './components/table/table.component';
import { HighlightRowOnHoverDirective } from './directives/highlight-row-on-hover.directive';
import { HoverClassOnSiblingsDirective } from './directives/hover-class-on-siblings.directive';
import { StylesDisplayComponent } from './styles-display/styles-display.component';

@NgModule({
  imports: [
    CheckboxGroupComponent,
    CheckboxInputComponent,
    ProjectNavbarComponent,
    HighlightRowOnHoverDirective,
    HoverClassOnSiblingsDirective,
    RadioGroupComponent,
    RadioInputComponent,
    SortArrowsComponent,
    StylesDisplayComponent,
    SvgDefinitionsComponent,
    SvgIconOldComponent,
    TableComponent,
  ],
  exports: [
    CheckboxGroupComponent,
    CheckboxInputComponent,
    ProjectNavbarComponent,
    HighlightRowOnHoverDirective,
    HoverClassOnSiblingsDirective,
    RadioGroupComponent,
    RadioInputComponent,
    SortArrowsComponent,
    StylesDisplayComponent,
    SvgDefinitionsComponent,
    SvgIconOldComponent,
    TableComponent,
  ],
})
export class SharedModule {}
