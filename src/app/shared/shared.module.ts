import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ContentNavbarComponent } from './content-navbar/content-navbar.component';
import { HighlightRowOnHoverDirective } from './directives/highlight-row-on-hover.directive';
import { HoverClassOnSiblingsDirective } from './directives/hover-class-on-siblings.directive';
import { StylesDisplayComponent } from './styles-display/styles-display.component';
import { SvgDefinitionsComponent } from './svg-icon/svg-definitions.component';
import { SvgIconComponent } from './svg-icon/svg-icon.component';

@NgModule({
    declarations: [
        SvgDefinitionsComponent,
        SvgIconComponent,
        HighlightRowOnHoverDirective,
        HoverClassOnSiblingsDirective,
        ContentNavbarComponent,
        StylesDisplayComponent,
    ],
    imports: [CommonModule, RouterModule],
    exports: [
        SvgDefinitionsComponent,
        SvgIconComponent,
        HighlightRowOnHoverDirective,
        HoverClassOnSiblingsDirective,
        ContentNavbarComponent,
        StylesDisplayComponent,
    ],
})
export class SharedModule {}
