/* eslint-disable @typescript-eslint/no-explicit-any */
import { SimpleChange } from '@angular/core';
import { NgChangesUtils } from './ng-changes.utils';

describe('UtilitiesService', () => {
  describe('objectChangedNotFirstTime()', () => {
    let objectChangedSpy: jasmine.Spy;
    let changes: any;
    let objectName: string;
    beforeEach(() => {
      objectChangedSpy = spyOn(
        NgChangesUtils,
        'objectOnNgChangesChanged'
      ).and.returnValue(true);
      objectName = 'test';
      changes = {
        [objectName]: new SimpleChange('', '', false),
      };
    });

    describe('if testObject has changes', () => {
      describe('if it is not the first change', () => {
        it('returns true if objectChanges returns true', () => {
          const result = NgChangesUtils.objectOnNgChangesChangedNotFirstTime(
            changes,
            objectName
          );
          expect(result).toEqual(true);
        });

        it('returns false if objectChanged returns false', () => {
          objectChangedSpy.and.returnValue(false);
          const result = NgChangesUtils.objectOnNgChangesChangedNotFirstTime(
            changes,
            objectName
          );
          expect(result).toEqual(false);
        });
      });

      it('returns false if it is the first change', () => {
        changes = {
          [objectName]: new SimpleChange('', '', true),
        };
        const result = NgChangesUtils.objectOnNgChangesChangedNotFirstTime(
          changes,
          objectName
        );
        expect(result).toEqual(false);
      });
    });

    it('returns false if changes does not have property for input string', () => {
      changes = { wrong: new SimpleChange('', '', false) };
      const result = NgChangesUtils.objectOnNgChangesChangedNotFirstTime(
        changes,
        objectName
      );
      expect(result).toEqual(false);
    });
  });

  describe('objectChanged()', () => {
    let changes: any;
    let objectName: string;
    let prevSpy: jasmine.Spy;
    let currSpy: jasmine.Spy;
    beforeEach(() => {
      prevSpy = spyOn(NgChangesUtils as any, 'getPreviousValue');
      currSpy = spyOn(NgChangesUtils as any, 'getCurrentValue');
      objectName = 'test';
      changes = {
        [objectName]: new SimpleChange('', '', false),
      };
    });

    it('calls getPreviousValue with changes, objectName, and property', () => {
      const property = 'testProperty';
      NgChangesUtils.objectOnNgChangesChanged(changes, objectName, property);
      expect(prevSpy).toHaveBeenCalledWith(changes, objectName, property);
    });

    it('calls getCurrentValue with changes, objectName, and property', () => {
      const property = 'testProperty';
      NgChangesUtils.objectOnNgChangesChanged(changes, objectName, property);
      expect(currSpy).toHaveBeenCalledWith(changes, objectName, property);
    });

    describe('if testObject has changes', () => {
      it('returns true if previous testObject value does not equal current testObject value -- deep check', () => {
        prevSpy.and.returnValue({ test: 'test' });
        currSpy.and.returnValue({ test: 'test2' });
        const result = NgChangesUtils.objectOnNgChangesChangedNotFirstTime(
          changes,
          objectName
        );
        expect(result).toEqual(true);
      });

      it('returns false if previous testObject equals current testObject value -- deep check', () => {
        prevSpy.and.returnValue({ test: 'test' });
        currSpy.and.returnValue({ test: 'test' });
        const result = NgChangesUtils.objectOnNgChangesChangedNotFirstTime(
          changes,
          objectName
        );
        expect(result).toEqual(false);
      });
    });

    it('returns false if changes does not have property for input string', () => {
      changes = { wrong: new SimpleChange('', '', false) };
      const result = NgChangesUtils.objectOnNgChangesChangedNotFirstTime(
        changes,
        objectName
      );
      expect(result).toEqual(false);
    });
  });
});
