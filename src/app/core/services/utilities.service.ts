/* eslint-disable no-var */
import { Injectable, SimpleChanges } from '@angular/core';
import { get, isEqual } from 'lodash';

@Injectable({
    providedIn: 'root',
})
export class UtilitiesService {
    objectChangedNotFirstTime(changes: SimpleChanges, object: string, property?: string): boolean {
        return (
            changes[object] !== undefined &&
            !changes[object].firstChange &&
            this.objectChanged(changes, object, property)
        );
    }

    objectChanged(changes: SimpleChanges, objectName: string, property?: string): boolean {
        const previousValue = this.getPreviousValue(changes, objectName, property);
        const currentValue = this.getCurrentValue(changes, objectName, property);
        return changes[objectName] !== undefined && !isEqual(previousValue, currentValue);
    }

    getPreviousValue(changes: SimpleChanges, objectName: string, property?: string): any {
        return property ? get(changes[objectName].previousValue, property) : changes[objectName].previousValue;
    }

    getCurrentValue(changes: SimpleChanges, objectName: string, property?: string): any {
        return property ? get(changes[objectName].currentValue, property) : changes[objectName].currentValue;
    }

    getSplitCategoryAndEntity(item: string): number[] {
        return item.split('-').map((x) => +x);
    }
}
