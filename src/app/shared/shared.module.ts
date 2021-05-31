import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ContentNavbarComponent } from './content-navbar/content-navbar.component';
import { RowHoverDirective } from './directives/row-hover.directive';
import { SvgDefinitionsComponent } from './svg-icon/svg-definitions.component';
import { SvgIconComponent } from './svg-icon/svg-icon.component';

@NgModule({
    declarations: [SvgDefinitionsComponent, SvgIconComponent, RowHoverDirective, ContentNavbarComponent],
    imports: [CommonModule, RouterModule],
    exports: [SvgDefinitionsComponent, SvgIconComponent, RowHoverDirective, ContentNavbarComponent],
})
export class SharedModule {}
