import { DOCUMENT } from '@angular/common';
import { DestroyRef, Inject, Injectable, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { distinctUntilChanged } from 'rxjs';
import { BreakpointsService } from '../../core/services/breakpoints.service';

@Injectable()
export class ExpandableImageService {
  hasRightColumn = signal(true);
  imageIsExpanded = signal(false);
  private backdrop: HTMLDivElement;

  constructor(
    @Inject(DOCUMENT) private document: Document,
    protected breakpoints: BreakpointsService
  ) {}

  init(destroyRef: DestroyRef): void {
    this.breakpoints.isCaseStudyCollapsed$
      .pipe(takeUntilDestroyed(destroyRef), distinctUntilChanged())
      .subscribe((isCollapsed) => {
        this.hasRightColumn.set(!isCollapsed);
        if (isCollapsed && this.backdrop) {
          this.document.body.removeChild(this.backdrop);
          this.backdrop = undefined;
        }
        if (!isCollapsed && this.imageIsExpanded()) {
          this.imageIsExpanded.set(false);
        }
      });
  }

  showImageModal(): void {
    if (!this.hasRightColumn()) {
      this.handleInlineExpansion();
      return;
    }
    if (this.imageIsExpanded() && this.backdrop) {
      this.removeModalBackground();
      return;
    }
    this.imageIsExpanded.set(true);
    this.backdrop = document.createElement('div');
    this.backdrop.className = 'modal-overlay';
    document.body.appendChild(this.backdrop);

    this.backdrop.addEventListener('click', () => {
      this.removeModalBackground();
    });
  }

  private handleInlineExpansion(): void {
    this.imageIsExpanded.set(!this.imageIsExpanded());
  }

  private removeModalBackground(): void {
    this.document.body.removeChild(this.backdrop);
    this.imageIsExpanded.set(false);
    this.backdrop = undefined;
  }
}
