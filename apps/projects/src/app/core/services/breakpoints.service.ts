import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';
import { Injectable } from '@angular/core';
import { Observable, map, shareReplay } from 'rxjs';

export enum Breakpoint {
  CaseStudyCollapse = 'caseStudyCollapse',
}

export const breakpointMaxWidth: Record<Breakpoint, number> = {
  [Breakpoint.CaseStudyCollapse]: 900,
};

export const breakpoints: Record<Breakpoint, string> = {
  [Breakpoint.CaseStudyCollapse]: `(max-width: ${breakpointMaxWidth[Breakpoint.CaseStudyCollapse]}px)`,
};

@Injectable({
  providedIn: 'root',
})
export class BreakpointsService {
  deviceState$: Observable<BreakpointState>;
  isCaseStudyCollapsed$: Observable<boolean>;
  isSmallScreen$: Observable<boolean>;
  currentSize$: Observable<Breakpoint>;

  constructor(private breakpointObserver: BreakpointObserver) {}

  initialize(): void {
    this.setDeviceStateChange();
    this.setIsCaseStudyCollapsed();
    this.setCurrentSize();
  }

  setDeviceStateChange(): void {
    const queries = Object.values(breakpoints);
    this.deviceState$ = this.breakpointObserver.observe(queries);
  }

  setIsCaseStudyCollapsed(): void {
    this.isCaseStudyCollapsed$ = this.deviceState$.pipe(
      map((observerResponse: BreakpointState) => {
        return observerResponse.breakpoints[breakpoints.caseStudyCollapse];
      }),
      shareReplay(1)
    );
  }

  setCurrentSize(): void {
    this.currentSize$ = this.deviceState$.pipe(
      map((observerResponse: BreakpointState) => {
        const activeBreakpoint = Object.entries(
          observerResponse.breakpoints
        ).find(([, isActive]) => isActive);
        if (activeBreakpoint) {
          const breakpointName = Object.entries(breakpoints).find(
            ([, definition]) => activeBreakpoint[0] === definition
          )[0] as Breakpoint;
          return breakpointName;
        } else {
          return undefined;
        }
      })
    );
  }
}
