import { NgModule, SkipSelf } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { ColorService } from './services/color.service';
import { ElementService } from './services/element.service';
import { UtilitiesService } from './services/utilities.service';
import { BeyondService } from '../projects/beyond/services/beyond.service';
import { FlipService } from '../projects/flip/services/flip.service';
import { Optional } from '@angular/core';
import { throwIfAlreadyLoaded } from './module-import-guard';
import { BeyondResource } from '../projects/beyond/resources/beyond.resource';
import { FlipResource } from '../projects/flip/resources/flip.resource';

@NgModule({
    imports: [CommonModule, HttpClientModule],
    providers: [
        ColorService,
        ElementService,
        UtilitiesService,
        FlipService,
        FlipResource,
        BeyondService,
        BeyondResource,
    ],
})
export class CoreModule {
    constructor(@Optional() @SkipSelf() parentModule: CoreModule) {
        throwIfAlreadyLoaded(parentModule, 'CoreModule');
    }
}
