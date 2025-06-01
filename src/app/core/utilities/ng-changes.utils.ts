/* eslint-disable no-var */
import { SimpleChanges } from '@angular/core';
import { get, isEqual } from 'lodash-es';

export class NgChangesUtils {
  static objectOnNgChangesChangedNotFirstTime(
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

  static objectOnNgChangesChanged(
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

  private static getPreviousValue(
    changes: SimpleChanges,
    objectName: string,
    property?: string
  ): unknown {
    return property
      ? get(changes[objectName].previousValue, property)
      : changes[objectName].previousValue;
  }

  private static getCurrentValue(
    changes: SimpleChanges,
    objectName: string,
    property?: string
  ): unknown {
    return property
      ? get(changes[objectName].currentValue, property)
      : changes[objectName].currentValue;
  }
}
