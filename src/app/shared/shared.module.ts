import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RowHoverDirective } from './directives/row-hover.directive';
import { SvgDefinitionsComponent } from './svg-icon/svg-definitions.component';
import { SvgIconComponent } from './svg-icon/svg-icon.component';

@NgModule({
    declarations: [SvgDefinitionsComponent, SvgIconComponent, RowHoverDirective],
    imports: [CommonModule],
    exports: [SvgDefinitionsComponent, SvgIconComponent, RowHoverDirective],
})
export class SharedModule {}
