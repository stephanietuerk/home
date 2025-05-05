import { Platform } from '@angular/cdk/platform';
import {
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  OnInit,
  ViewChild,
} from '@angular/core';
import { filter, skip, takeUntil } from 'rxjs';
import { Unsubscribe } from 'src/app/shared/unsubscribe.directive';
import {
  ComboboxActionType,
  ComboboxService,
  Key,
  ListboxAction,
  OptionAction,
  TextboxAction,
  VisualFocus,
} from '../combobox.service';

@Component({
    selector: 'app-textbox',
    templateUrl: './textbox.component.html',
    standalone: false
})
export class TextboxComponent
  extends Unsubscribe
  implements OnInit, AfterViewInit
{
  @Input() displaySelected = false;
  @Input() findsOptionOnTyping = true;
  @Input() ariaLabel?: string;
  @ViewChild('box') box: ElementRef<HTMLDivElement>;
  @ViewChild('boxIcon') boxIcon: ElementRef<HTMLDivElement>;
  openKeys = ['ArrowDown', 'ArrowUp', 'Enter', ' '];

  constructor(
    public service: ComboboxService,
    private platform: Platform
  ) {
    super();
  }

  ngOnInit(): void {
    this.service.displayValue = this.displaySelected;
  }

  ngAfterViewInit(): void {
    this.setFocusListener();
  }

  setFocusListener(): void {
    this.service.visualFocus$
      .pipe(
        takeUntil(this.unsubscribe),
        skip(1),
        filter((focus) => focus === VisualFocus.textbox)
      )
      .subscribe(() => {
        this.focusBox();
      });
  }

  focusBox(): void {
    this.box.nativeElement.focus();
  }

  handleBlur(event: FocusEvent): void {
    if (event.relatedTarget && this.isHtmlElement(event.relatedTarget)) {
      if (event.relatedTarget.id.includes('listbox')) {
        this.service.setVisualFocus(VisualFocus.textbox);
        return;
      } else if (event.relatedTarget.tagName === 'BODY' && this.isMobile()) {
        this.focusBox();
        return;
      }
    }
    this.service.emitBlurEvent();
  }

  isHtmlElement(target: EventTarget): target is HTMLElement {
    return 'id' in target;
  }

  isMobile(): boolean {
    return this.platform.IOS || this.platform.ANDROID;
  }

  handleClick(): void {
    if (this.service.isOpen) {
      this.service.closeListbox();
    } else {
      this.service.openListbox();
    }
    this.focusBox();
  }

  handleKeydown(event: KeyboardEvent): void {
    if (event.key === 'Escape') {
      this.onEscape();
    } else {
      const action = this.getActionFromKeydownEvent(event);
      this.handleComboboxAction(action, event);
    }
  }

  onEscape(): void {
    this.service.closeListbox();
    this.service.setVisualFocus(VisualFocus.textbox);
  }

  getActionFromKeydownEvent(event: KeyboardEvent): ComboboxActionType {
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

  getActionFromKeyEventWhenOpen(event: KeyboardEvent): ComboboxActionType {
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

  handleComboboxAction(action: ComboboxActionType, event: KeyboardEvent): void {
    switch (action) {
      case OptionAction.first:
      case OptionAction.last:
        this.service.openListbox();
        this.focusBox();
        event.preventDefault();
        return this.service.emitOptionAction(action);

      case OptionAction.next:
      case OptionAction.pageDown:
      case OptionAction.previous:
      case OptionAction.pageUp:
      case OptionAction.select:
        event.preventDefault();
        return this.service.emitOptionAction(action);

      case ListboxAction.closeSelect:
        event.preventDefault();
        this.service.emitOptionAction(OptionAction.select);
        this.service.closeListbox();
        this.focusBox();
        return this.service.emitOptionAction(OptionAction.nullActiveIndex);

      case ListboxAction.close:
        event.preventDefault();
        this.service.closeListbox();
        this.focusBox();
        return this.service.emitOptionAction(OptionAction.nullActiveIndex);

      case TextboxAction.type:
        this.service.openListbox();
        this.focusBox();
        return this.service.emitOptionAction(event.key);

      case ListboxAction.open:
        event.preventDefault();
        this.service.emitOptionAction(OptionAction.zeroActiveIndex);
        this.service.openListbox();
        return this.focusBox();
    }
  }
}
