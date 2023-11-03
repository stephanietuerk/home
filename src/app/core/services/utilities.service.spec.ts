import { SimpleChange } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { UtilitiesService } from './utilities.service';

describe('UtilitiesService', () => {
    let service: UtilitiesService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(UtilitiesService);
    });

    describe('objectChangedNotFirstTime()', () => {
        let objectChangedSpy: jasmine.Spy;
        let changes: any;
        let objectName: string;
        beforeEach(() => {
            objectChangedSpy = spyOn(service, 'objectChanged').and.returnValue(true);
            objectName = 'test';
            changes = {
                [objectName]: new SimpleChange('', '', false),
            };
        });

        describe('if testObject has changes', () => {
            describe('if it is not the first change', () => {
                it('returns true if objectChanges returns true', () => {
                    const result = service.objectOnNgChangesChangedNotFirstTime(changes, objectName);
                    expect(result).toEqual(true);
                });

                it('returns false if objectChanged returns false', () => {
                    objectChangedSpy.and.returnValue(false);
                    const result = service.objectOnNgChangesChangedNotFirstTime(changes, objectName);
                    expect(result).toEqual(false);
                });
            });

            it('returns false if it is the first change', () => {
                changes = {
                    [objectName]: new SimpleChange('', '', true),
                };
                const result = service.objectOnNgChangesChangedNotFirstTime(changes, objectName);
                expect(result).toEqual(false);
            });
        });

        it('returns false if changes does not have property for input string', () => {
            changes = { wrong: new SimpleChange('', '', false) };
            const result = service.objectOnNgChangesChangedNotFirstTime(changes, objectName);
            expect(result).toEqual(false);
        });
    });

    describe('objectChanged()', () => {
        let changes: any;
        let objectName: string;
        let prevSpy: jasmine.Spy;
        let currSpy: jasmine.Spy;
        beforeEach(() => {
            prevSpy = spyOn(service, 'getPreviousValue');
            currSpy = spyOn(service, 'getCurrentValue');
            objectName = 'test';
            changes = {
                [objectName]: new SimpleChange('', '', false),
            };
        });

        it('calls getPreviousValue with changes, objectName, and property', () => {
            const property = 'testProperty';
            service.objectOnNgChangesChanged(changes, objectName, property);
            expect(prevSpy).toHaveBeenCalledWith(changes, objectName, property);
        });

        it('calls getCurrentValue with changes, objectName, and property', () => {
            const property = 'testProperty';
            service.objectOnNgChangesChanged(changes, objectName, property);
            expect(currSpy).toHaveBeenCalledWith(changes, objectName, property);
        });

        describe('if testObject has changes', () => {
            it('returns true if previous testObject value does not equal current testObject value -- deep check', () => {
                prevSpy.and.returnValue({ test: 'test' });
                currSpy.and.returnValue({ test: 'test2' });
                const result = service.objectOnNgChangesChangedNotFirstTime(changes, objectName);
                expect(result).toEqual(true);
            });

            it('returns false if previous testObject equals current testObject value -- deep check', () => {
                prevSpy.and.returnValue({ test: 'test' });
                currSpy.and.returnValue({ test: 'test' });
                const result = service.objectOnNgChangesChangedNotFirstTime(changes, objectName);
                expect(result).toEqual(false);
            });
        });

        it('returns false if changes does not have property for input string', () => {
            changes = { wrong: new SimpleChange('', '', false) };
            const result = service.objectOnNgChangesChangedNotFirstTime(changes, objectName);
            expect(result).toEqual(false);
        });
    });
});
