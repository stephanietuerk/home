import { Injectable } from '@angular/core';
import { environmentConstants } from '../constants/environment.constants';
import { Environments, EnvironmentSettings } from '../models/environments.model';

@Injectable({
    providedIn: 'root',
})
export class EnvironmentService {
    environment: Environments;
    environmentSettings: EnvironmentSettings;

    constructor() {
        this.getSettings();
    }

    private getSettings(): void {
        const origin = window.location.href;
        this.environment = environmentConstants;
        if (origin.indexOf('localhost') > -1) {
            this.environmentSettings = this.environment.local;
        } else if (origin.indexOf('personal-site-c3c69') > -1) {
            this.environmentSettings = this.environment.production;
        } else if (origin.indexOf('stephanietuerk') > -1) {
            this.environmentSettings = this.environment.production;
        } else {
            console.error('Unknown Environment');
        }
    }
}
