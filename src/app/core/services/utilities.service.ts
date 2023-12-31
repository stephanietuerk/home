/* eslint-disable no-var */
import { Injectable, SimpleChanges } from '@angular/core';
import { get, isEqual } from 'lodash-es';

@Injectable({
  providedIn: 'root',
})
export class UtilitiesService {
  objectOnNgChangesChangedNotFirstTime(
    changes: SimpleChanges,
    object: string,
    property?: string
  ): boolean {
    return (
      changes[object] !== undefined &&
      !changes[object].firstChange &&
      this.objectOnNgChangesChanged(changes, object, property)
    );
  }

  objectOnNgChangesChanged(
    changes: SimpleChanges,
    objectName: string,
    property?: string
  ): boolean {
    const previousValue = this.getPreviousValue(changes, objectName, property);
    const currentValue = this.getCurrentValue(changes, objectName, property);
    return (
      changes[objectName] !== undefined && !isEqual(previousValue, currentValue)
    );
  }

  getPreviousValue(
    changes: SimpleChanges,
    objectName: string,
    property?: string
  ): any {
    return property
      ? get(changes[objectName].previousValue, property)
      : changes[objectName].previousValue;
  }

  getCurrentValue(
    changes: SimpleChanges,
    objectName: string,
    property?: string
  ): any {
    return property
      ? get(changes[objectName].currentValue, property)
      : changes[objectName].currentValue;
  }

  isDate(x: any): boolean {
    return Object.prototype.toString.call(x) === '[object Date]' && !isNaN(x);
  }
}
