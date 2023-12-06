import { DOCUMENT } from '@angular/common';
import { Inject, Injectable } from '@angular/core';
import { environmentConstants } from '../constants/environment.constants';
import { EnvironmentSettings } from '../models/environments.model';
import { Environment, EnvironmentOption } from '../models/project.model';

@Injectable({
  providedIn: 'root',
})
export class EnvironmentService {
  origin: string;
  environments = environmentConstants;
  currentEnvironment: EnvironmentSettings;
  localStrings: string[] = ['localhost'];
  productionStrings: string[] = ['personal-site-c3c69', 'stephanietuerk'];
  errorMessage: 'Cannot determine environment';

  constructor(@Inject(DOCUMENT) private document: Document) {
    this.origin = this.document.location.href;
  }

  init(): void {
    if (this.originInArray(this.localStrings)) {
      this.currentEnvironment = this.environments.local;
    } else if (this.originInArray(this.productionStrings)) {
      this.currentEnvironment = this.environments.production;
    } else {
      console.error(this.errorMessage);
    }
  }

  private isLocal(): boolean {
    return this.originInArray(this.localStrings);
  }

  private isProduction(): boolean {
    return this.originInArray(this.productionStrings);
  }

  private originInArray(arr: string[]): boolean {
    return arr.some((x) => this.origin.match(new RegExp(x, 'gi')));
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
