import { Injectable } from '@angular/core';
import { environmentConstants } from '../constants/environment.constants';
import {
  Environments,
  EnvironmentSettings,
} from '../models/environments.model';
import { Environment, EnvironmentOption } from '../models/project.model';

@Injectable({
  providedIn: 'root',
})
export class EnvironmentService {
  environment: Environments;
  environmentSettings: EnvironmentSettings;
  localStrings: string[] = ['localhost'];
  productionStrings: string[] = ['personal-site-c3c69', 'stephanietuerk'];
  errorMessage: 'Cannot determine environment';

  constructor() {
    this.getSettings();
  }

  private getSettings(): void {
    const origin = window.location.href;
    this.environment = environmentConstants;
    if (this.stringInArray(origin, this.localStrings)) {
      this.environmentSettings = this.environment.local;
    } else if (this.stringInArray(origin, this.productionStrings)) {
      this.environmentSettings = this.environment.production;
    } else {
      console.error(this.errorMessage);
    }
  }

  private isLocal(): boolean {
    const origin = window.location.href;
    return this.stringInArray(origin, this.localStrings);
  }

  private isProduction(): boolean {
    const origin = window.location.href;
    return this.stringInArray(origin, this.productionStrings);
  }

  private stringInArray(str: string, arr: string[]): boolean {
    return arr.some((x) => str.match(new RegExp(x, 'gi')));
  }

  getEnvironment(): EnvironmentOption {
    if (this.isLocal()) {
      return Environment.local;
    } else if (this.isProduction()) {
      return Environment.production;
    } else {
      console.error(this.errorMessage);
    }
  }
}
