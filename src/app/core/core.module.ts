import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule, Optional, SkipSelf } from '@angular/core';
import { BeyondService } from '../projects/beyond/services/beyond.service';
import { FlipResource } from '../projects/flip/resources/flip.resource';
import { FlipService } from '../projects/flip/services/flip.service';
import { throwIfAlreadyLoaded } from './module-import-guard';
import { EnvironmentService } from './services/environment.service';

@NgModule({
    imports: [CommonModule, HttpClientModule],
    providers: [FlipService, FlipResource, BeyondService, EnvironmentService],
})
export class CoreModule {
    constructor(@Optional() @SkipSelf() parentModule: CoreModule) {
        throwIfAlreadyLoaded(parentModule, 'CoreModule');
    }
}
