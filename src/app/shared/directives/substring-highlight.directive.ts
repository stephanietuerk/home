/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  Directive,
  ElementRef,
  Input,
  NgZone,
  OnChanges,
  Renderer2,
  SimpleChanges,
} from '@angular/core';
import { range } from 'lodash-es';

interface SegmentDef {
  range: number[];
  highlight: boolean;
}

export interface TextSegmentDef {
  text: string;
  highlight: boolean;
}

@Directive({
  selector: '[appSubstringHighlight]',
  standalone: true,
})
export class SubstringHighlightDirective implements OnChanges {
  @Input('appSubstringHighlight') highlightTerms: string[];
  @Input() string: string;
  isInitialized = false;
  hasHighlights = false;
  mainSpan: HTMLSpanElement;

  constructor(
    private elementRef: ElementRef,
    private renderer: Renderer2,
    private zone: NgZone
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (this.elementRef.nativeElement && changes['highlightTerms']) {
      if (!this.isInitialized) {
        this.initialize();
      }
      if (this.shouldHighlight()) {
        this.highlightText();
      } else if (this.hasHighlights) {
        this.removeHighlight();
      }
    }
  }

  initialize(): void {
    this.zone.run(() => {
      const span = this.renderer.createElement('span');
      this.renderer.setProperty(span, 'innerHTML', this.string);
      this.renderer.appendChild(this.elementRef.nativeElement, span);
      this.mainSpan = span;
    });
    this.isInitialized = true;
  }

  shouldHighlight(): boolean {
    return this.highlightTerms.length > 0;
  }

  highlightText(): void {
    const segments = this.getHighlightedTextSegments();
    this.createSpansFromSegments(segments);
    this.hasHighlights = true;
  }

  getHighlightedTextSegments(): TextSegmentDef[] {
    const matchedIndices = this.getMatchedTextIndices(
      this.string,
      this.highlightTerms
    );
    const unmatchedIndices = range(0, this.string.length).filter(
      (x) => !matchedIndices.some((i) => i === x)
    );
    const matchedSegmentDefs = this.getSegmentDefs(matchedIndices, true);
    const unmatchedSegmentDefs = this.getSegmentDefs(unmatchedIndices, false);
    const allSegmentDefs = matchedSegmentDefs.concat(unmatchedSegmentDefs);
    const sortedSegmentDefs = allSegmentDefs.sort(
      (a, b) => a.range[0] - b.range[0]
    );
    const textSegmentDefs: TextSegmentDef[] = sortedSegmentDefs.map((x) => {
      return {
        text: this.string.slice(x.range[0], x.range[1]),
        highlight: x.highlight,
      };
    });
    return textSegmentDefs;
  }

  getMatchedTextIndices(fullString: string, searchTerms: string[]): number[] {
    const indices: number[] = [];
    searchTerms.forEach((term) => {
      const regexExp = RegExp(term.toLowerCase(), 'g');
      while (regexExp.exec(fullString.toLowerCase()) !== null) {
        const matchedTextIndices =
          term.length === 1
            ? [regexExp.lastIndex - 1]
            : range(regexExp.lastIndex - term.length, regexExp.lastIndex);
        indices.push(...matchedTextIndices);
      }
    });
    return [...new Set(indices)];
  }

  getSegmentDefs(
    listOfIndices: number[],
    isHighlighted: boolean
  ): SegmentDef[] {
    const consecutivelyGroupedIndices =
      this.getConsecutivelyGroupedIndices(listOfIndices);
    const rangeOfIndices = this.getRangeOfIndices(consecutivelyGroupedIndices);
    const segmentDefs: SegmentDef[] = rangeOfIndices.map((range) => {
      return {
        range,
        highlight: isHighlighted,
      };
    });
    return segmentDefs;
  }

  getConsecutivelyGroupedIndices(indices: number[]): number[][] {
    return indices.reduce((acc, curr, i, arr) => {
      if (curr !== arr[i - 1] + 1) acc.push([]);
      acc[acc.length - 1].push(curr);
      return acc;
    }, []);
  }

  getRangeOfIndices(groupedIndices: number[][]): number[][] {
    const range: number[][] = [];
    groupedIndices.forEach((group) => {
      const { 0: a, [group.length - 1]: b } = group;
      range.push([a, b + 1]);
    });
    return range;
  }

  createSpansFromSegments(segments: TextSegmentDef[]): void {
    this.zone.run(() => {
      this.removeSpans();
      segments.forEach((segment, i) => {
        const span = this.renderer.createElement('span');
        if (segment.highlight) {
          this.renderer.addClass(span, 'highlight');
          this.renderer.setAttribute(span, 'data-cy', 'search-highlight');
        }
        this.renderer.setProperty(span, 'innerHTML', segment.text);
        this.renderer.appendChild(this.mainSpan, span);
      });
    });
  }

  removeSpans(): void {
    this.renderer.setProperty(this.mainSpan, 'innerHTML', '');
    Array.from(this.mainSpan.children).forEach((child) => {
      this.renderer.removeChild(this.mainSpan, child);
    });
  }

  removeHighlight(): void {
    Array.from(this.mainSpan.children).forEach((child) => {
      if (child.classList.contains('highlight')) {
        this.renderer.removeClass(child, 'highlight');
      }
    });
    this.hasHighlights = false;
  }
}
