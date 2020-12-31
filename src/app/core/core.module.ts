import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { RowHoverDirective } from '../shared/directives/row-hover.directive';
import { ColorService } from './services/color.service';
import { ElementService } from './services/element.service';
import { UtilitiesService } from './services/utilities.service';

@NgModule({
    imports: [CommonModule, HttpClientModule],
    providers: [ColorService, ElementService, UtilitiesService],
})
export class CoreModule {}
