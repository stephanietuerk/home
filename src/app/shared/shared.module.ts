import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ContentNavbarComponent } from './content-navbar/content-navbar.component';
import { ButtonHoverDirective } from './directives/button-hover.directive';
import { RowHoverDirective } from './directives/row-hover.directive';
import { StylesDisplayComponent } from './styles-display/styles-display.component';
import { SvgDefinitionsComponent } from './svg-icon/svg-definitions.component';
import { SvgIconComponent } from './svg-icon/svg-icon.component';

@NgModule({
    declarations: [
        SvgDefinitionsComponent,
        SvgIconComponent,
        RowHoverDirective,
        ButtonHoverDirective,
        ContentNavbarComponent,
        StylesDisplayComponent,
    ],
    imports: [CommonModule, RouterModule],
    exports: [
        SvgDefinitionsComponent,
        SvgIconComponent,
        RowHoverDirective,
        ButtonHoverDirective,
        ContentNavbarComponent,
        StylesDisplayComponent,
    ],
})
export class SharedModule {}
