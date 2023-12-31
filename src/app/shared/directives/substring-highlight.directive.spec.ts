/* eslint-disable @typescript-eslint/no-explicit-any */
import { ElementRef, Renderer2 } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { SubstringHighlightDirective } from './substring-highlight.directive';

describe('SubstringHighlightDirective', () => {
  let directive: SubstringHighlightDirective;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        SubstringHighlightDirective,
        Renderer2,
        {
          provide: ElementRef,
          useValue: new ElementRef(document.createElement('div')),
        },
      ],
    });
    directive = TestBed.inject(SubstringHighlightDirective);
  });

  describe('ngOnChanges', () => {
    let shouldHighlightSpy: jasmine.Spy;
    beforeEach(() => {
      shouldHighlightSpy = spyOn(directive, 'shouldHighlight');
      spyOn(directive, 'highlightText');
      spyOn(directive, 'initialize');
    });
    describe('if there is a nativeElement and highlight terms', () => {
      beforeEach(() => {
        (directive as any).elementRef.nativeElement =
          document.createElement('div');
        directive.highlightTerms = ['abc'];
      });
      it('calls initialize if isInitialized is false', () => {
        directive.isInitialized = false;
        directive.ngOnChanges();
        expect(directive.initialize).toHaveBeenCalledTimes(1);
      });
      it('does not call initialize if isInitialized is true', () => {
        directive.isInitialized = true;
        directive.ngOnChanges();
        expect(directive.initialize).not.toHaveBeenCalled();
      });
      it('calls shouldHighlight', () => {
        directive.ngOnChanges();
        expect(directive.shouldHighlight).toHaveBeenCalledTimes(1);
      });
      it('calls highlightText if shouldHighlight returns true', () => {
        shouldHighlightSpy.and.returnValue(true);
        directive.ngOnChanges();
        expect(directive.highlightText).toHaveBeenCalledTimes(1);
      });
      it('does not call highlightText if shouldHighlight returns false', () => {
        shouldHighlightSpy.and.returnValue(false);
        directive.ngOnChanges();
        expect(directive.highlightText).not.toHaveBeenCalled();
      });
    });
  });

  describe('shouldHighlight', () => {
    it('returns true if searchTerms len > 0', () => {
      directive.highlightTerms = ['abc'];
      directive.string = 'measure name';
      expect(directive.shouldHighlight()).toBeTrue();
    });
    it('returns false if searchTerms is empty', () => {
      directive.highlightTerms = [];
      directive.string = 'measure name';
      expect(directive.shouldHighlight()).toBeFalse();
    });
  });

  describe('highlightText', () => {
    beforeEach(() => {
      spyOn(directive, 'getHighlightedTextSegments').and.returnValue(
        'text segments' as any
      );
      spyOn(directive, 'createSpansFromSegments');
    });
    it('calls getHighlightedTextSegments', () => {
      directive.highlightText();
      expect(directive.getHighlightedTextSegments).toHaveBeenCalledTimes(1);
    });
    it('calls createSpansFromSegments', () => {
      directive.highlightText();
      expect(directive.createSpansFromSegments).toHaveBeenCalledOnceWith(
        'text segments' as any
      );
    });
  });

  describe('getHighlightedTextSegments', () => {
    it('integration: returns the correct text segment defs', () => {
      directive.string = 'abc def ghi';
      directive.highlightTerms = ['c d', 'gh'];
      expect(directive.getHighlightedTextSegments()).toEqual([
        { text: 'ab', highlight: false },
        { text: 'c d', highlight: true },
        { text: 'ef ', highlight: false },
        { text: 'gh', highlight: true },
        { text: 'i', highlight: false },
      ]);
    });
  });

  describe('getMatchedTextIndices', () => {
    it('integration: returns the correctly matched text indices', () => {
      const fullString = 'abc def ghi';
      const searchTerms = ['c d', 'gh'];
      expect(directive.getMatchedTextIndices(fullString, searchTerms)).toEqual([
        2, 3, 4, 8, 9,
      ]);
    });
  });

  describe('getSegmentDefs', () => {
    it('integration: returns the correct segment defs', () => {
      const listOfIndices = [2, 3, 4, 8, 9];
      const isHighlighted = true;
      expect(directive.getSegmentDefs(listOfIndices, isHighlighted)).toEqual([
        { range: [2, 5], highlight: true },
        { range: [8, 10], highlight: true },
      ]);
    });
  });

  describe('getConsecutivelyGroupedIndices', () => {
    it('returns the consecutively grouped indices', () => {
      const listOfIndices = [2, 3, 4, 8, 9];
      expect(directive.getConsecutivelyGroupedIndices(listOfIndices)).toEqual([
        [2, 3, 4],
        [8, 9],
      ]);
    });
  });

  describe('getRangeOfIndices', () => {
    it('returns the range of each group of indices', () => {
      const listOfGroupedIndices = [
        [2, 3, 4],
        [8, 9],
      ];
      expect(directive.getRangeOfIndices(listOfGroupedIndices)).toEqual([
        [2, 5],
        [8, 10],
      ]);
    });
  });
});
