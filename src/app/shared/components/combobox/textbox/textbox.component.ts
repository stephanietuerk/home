import { Platform } from '@angular/cdk/platform';
import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  Component,
  DestroyRef,
  ElementRef,
  inject,
  Input,
  NgZone,
  OnInit,
  ViewChild,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { BehaviorSubject, combineLatest, filter, startWith } from 'rxjs';
import { runNgChangeDetectionThen } from '../../../../core/utilities/run-ng-change-detection-then';
import {
  ComboboxAction,
  ComboboxService,
  FocusTextbox,
  Key,
  ListboxAction,
  OptionAction,
  TextboxAction,
} from '../combobox.service';
import { ListboxOptionComponent } from '../listbox-option/listbox-option.component';
import { SelectedCountLabel } from '../listbox/listbox.component';

@Component({
  selector: 'app-textbox',
  imports: [CommonModule],
  styleUrls: ['./textbox.component.scss'],
  templateUrl: './textbox.component.html',
  host: {
    class: 'textbox',
  },
})
export class TextboxComponent implements OnInit, AfterViewInit {
  @Input() ariaLabel: string;
  @Input() selectedCountLabel?: SelectedCountLabel;
  @Input() customLabel: (selectedOptions: ListboxOptionComponent[]) => string;
  /*
   * Whether the textbox label responds to selections in any way.
   *
   * If true, the textbox label will display the selected option(s) if no other label properties are provided.
   *
   * @default true
   */
  @Input() dynamicLabel = true;
  @Input() findsOptionOnTyping = true;
  @ViewChild('box') box: ElementRef<HTMLDivElement>;
  @ViewChild('boxIcon') boxIcon: ElementRef<HTMLDivElement>;
  openKeys = ['ArrowDown', 'ArrowUp', 'Enter', ' '];
  label: BehaviorSubject<string> = new BehaviorSubject('');
  label$ = this.label.asObservable();
  protected destroyRef = inject(DestroyRef);
  public service = inject(ComboboxService);
  private platform = inject(Platform);
  protected zone = inject(NgZone);

  ngOnInit(): void {
    this.service.projectedContentIsInDOM$
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        filter((x) => !!x),
        // Required because the label is projected into the ListboxOption via <ng-content>, and the
        // listbox options are <ng-template>s that are projected into the listbox via ngTemplateOutlet.
        // We need this to ensure that the option labels are in the DOM to read from before we set the box label.
        runNgChangeDetectionThen(this.zone)
      )
      .subscribe(() => {
        this.setLabel();
      });
  }

  ngAfterViewInit(): void {
    this.setFocusListener();
  }

  setFocusListener(): void {
    this.service.focusTextbox$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((focusType) => {
        if (!this.isMobile() || focusType === FocusTextbox.includeMobile) {
          this.focusBox();
        }
      });
  }

  focusBox(): void {
    this.box.nativeElement.focus();
  }

  handleBlur(event: FocusEvent): void {
    // DESCRIPTION OF HOW VARIOUS DEVICES/ASSISTIVE TECHNOLOGIES DO/NOT TRIGGER ANY BLUR EVENT (FocusEvent)
    // clicking (desktop) will trigger a blur event (item is focused, user clicks away, blur event fires)
    // keyboard navigation (desktop) will not trigger a blur event (item is focused, user navigates to another item, blur event does not fire)
    // tapping (mobile) will trigger a blur event (item is focused, user taps away, blur event fires)
    // swiping (VoiceOver) will trigger a blur event (item is focused, user swipes away, blur event fires)

    // The code below (lines 106 - 116) will refocus the textbox when the textbox receives blur event, and the
    // source of the blue event (related target) is something in the listbox.
    // We keep the focus on the textbox so that we can continue to listen for keyboard events to provide
    // keyboard navigation/interaction with the listbox options. The refocusing does not affect keyboard navigation,
    // and is unnoticable to the user.

    // However, VoiceOver (iOS assistive tech) will move the navigation back to the textbox when the textbox is focused,
    // which means the user will need to strt navigating the options from the top of the listbox every time they select
    // an option. (If we throw the focus). For this reason, we have decided that we will not support keyboard navigation
    // (which would need to happen on a connected external keybord) on mobile devices, as keyboard nav requires that the
    // focus stays on the textbox. Ostensibly it is standard practice to not support keyboard navigation on mobile devices.

    if (!this.isMobile()) {
      if (event.relatedTarget && this.isHtmlElement(event.relatedTarget)) {
        // when the blur happens because a listbox option was focused
        if (
          event.relatedTarget.id.includes('listbox') ||
          event.relatedTarget.classList.contains('listbox-group') ||
          event.relatedTarget.classList.contains('listbox-group-label')
        ) {
          this.service.emitTextboxFocus();
          return;
        }
      }
      this.service.emitTextboxBlur();
    }
  }

  isHtmlElement(target: EventTarget): target is HTMLElement {
    return 'id' in target;
  }

  isMobile(): boolean {
    return this.platform.IOS || this.platform.ANDROID;
  }

  handleClick(): void {
    this.service.setIsKeyboardEvent(false);
    if (this.service.isOpen) {
      this.service.closeListbox();
    } else {
      this.service.setTouched();
      this.service.openListbox();
    }
    this.focusBox();
  }

  handleKeydown(event: KeyboardEvent): void {
    if (event.key === 'Escape') {
      this.onEscape();
    } else {
      this.service.setTouched();
      this.service.setIsKeyboardEvent(true);
      const action = this.getActionFromKeydownEvent(event);
      this.handleKeyboardAction(action, event);
    }
  }

  onEscape(): void {
    this.service.closeListbox();
    this.service.emitTextboxFocus();
  }

  getActionFromKeydownEvent(event: KeyboardEvent): ComboboxAction {
    if (!this.service.isOpen && this.openKeys.includes(event.key)) {
      return ListboxAction.open;
    }
    if (event.key === Key.Home) {
      return OptionAction.first;
    }
    if (event.key === Key.End) {
      return OptionAction.last;
    }
    if (this.findsOptionOnTyping && this.isTypingCharacter(event)) {
      return TextboxAction.type;
    }
    if (this.service.isOpen) {
      return this.getActionFromKeyEventWhenOpen(event);
    } else {
      return null;
    }
  }

  isTypingCharacter(event: KeyboardEvent): boolean {
    const { key, altKey, ctrlKey, metaKey } = event;
    return (
      key === 'Backspace' ||
      key === 'Clear' ||
      (key.length === 1 && key !== ' ' && !altKey && !ctrlKey && !metaKey)
    );
  }

  getActionFromKeyEventWhenOpen(event: KeyboardEvent): ComboboxAction {
    const { key, altKey } = event;
    if (key === Key.ArrowUp && altKey) {
      return ListboxAction.closeSelect;
    } else if (key === Key.ArrowDown && !altKey) {
      return OptionAction.next;
    } else if (key === Key.ArrowUp) {
      return OptionAction.previous;
    } else if (key === Key.PageUp) {
      return OptionAction.pageUp;
    } else if (key === Key.PageDown) {
      return OptionAction.pageDown;
    } else if (key === Key.Enter || key === Key.Space) {
      return this.service.isMultiSelect
        ? OptionAction.select
        : ListboxAction.closeSelect;
    } else {
      return null;
    }
  }

  handleKeyboardAction(action: ComboboxAction, event: KeyboardEvent): void {
    switch (action) {
      case OptionAction.first:
      case OptionAction.last:
        this.service.openListbox();
        this.focusBox();
        event.preventDefault();
        this.service.emitOptionAction(action);
        break;

      case OptionAction.next:
      case OptionAction.pageDown:
      case OptionAction.previous:
      case OptionAction.pageUp:
      case OptionAction.select:
        event.preventDefault();
        this.service.emitOptionAction(action);
        break;

      case ListboxAction.closeSelect:
        event.preventDefault();
        this.service.emitOptionAction(OptionAction.select);
        this.service.closeListbox();
        this.focusBox();
        break;

      case ListboxAction.close:
        event.preventDefault();
        this.service.closeListbox();
        this.focusBox();
        break;

      case TextboxAction.type:
        this.service.openListbox();
        this.focusBox();
        this.service.emitOptionAction(event.key);
        break;

      case ListboxAction.open:
        event.preventDefault();
        this.service.openListbox();
        this.focusBox();
    }
  }

  setLabel(): void {
    if (this.dynamicLabel) {
      combineLatest([
        this.service.touched$,
        this.service.allOptions$, // when options (not properties) change
        this.service.selectedOptionsToEmit$, // when a user clicks
        this.service.optionPropertyChanges$.pipe(
          filter((x) => !!x),
          startWith(null)
        ), // on an outside change,
      ])
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe(([touched, options]) => {
          const label = this.getComputedLabel(touched, options);
          this.label.next(label);
        });
    }
  }

  getComputedLabel(
    touched: boolean,
    options: ListboxOptionComponent[]
  ): string {
    const selectedOptions = this.service.getSelectedOptions(options);
    let label = '';
    const numSelected = selectedOptions?.length;
    if (touched || numSelected) {
      if (this.customLabel && !this.service.hasEditableTextbox) {
        label = this.customLabel(selectedOptions);
      } else if (this.selectedCountLabel && !this.service.hasEditableTextbox) {
        if (numSelected === 1) {
          label = `${numSelected} ${this.selectedCountLabel.singular} selected`;
        } else {
          label = `${numSelected} ${this.selectedCountLabel.plural} selected`;
        }
      } else {
        label = this.getDefaultLabel(selectedOptions);
      }
    }
    return label;
  }

  getDefaultLabel(selectedOptions: ListboxOptionComponent[]): string {
    let label = '';
    if (selectedOptions) {
      label = selectedOptions
        .reduce((acc, option) => {
          const value =
            option.boxDisplayLabel ??
            option.label?.nativeElement.innerText.trim();
          if (value) {
            acc.push(value);
          }
          return acc;
        }, [])
        .join(', ');
    }
    return label;
  }
}
