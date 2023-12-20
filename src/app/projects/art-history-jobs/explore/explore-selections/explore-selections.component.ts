import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  Input,
  OnDestroy,
  TemplateRef,
  ViewChild,
  ViewContainerRef,
  ViewEncapsulation,
} from '@angular/core';
import { BehaviorSubject, Subscription } from 'rxjs';
import { animations } from 'src/app/core/constants/animations.constants';
import {
  ConnectedOverlayConfig,
  OverlayService,
  aboveLeftAligned,
  belowLeftAligned,
} from 'src/app/core/services/overlay.service';
import { SelectionOption } from 'src/app/shared/components/form-components/form-radio-input/form-radio-input.model';
import { Unsubscribe } from 'src/app/shared/unsubscribe.directive';
import { artHistoryFields } from '../../art-history-fields.constants';
import { ExploreDataService } from '../explore-data.service';
import {
  rankValueOptions,
  tenureValueOptions,
  valueTypeOptions,
  variableUseOptions,
} from './explore-selections.constants';

interface DropdownContent {
  isOpen: boolean;
  content: keyof typeof ExploreSelection | null;
}

export enum ExploreSelection {
  fields = 'fields',
  dataType = 'dataType',
  timeRange = 'timeRange',
  tenure = 'tenure',
  rank = 'rank',
}

@Component({
  selector: 'app-explore-selections',
  templateUrl: './explore-selections.component.html',
  styleUrls: ['./explore-selections.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [animations.slide('selection-interface')],
  providers: [OverlayService],
})
export class ExploreSelectionsComponent
  extends Unsubscribe
  implements OnDestroy
{
  @Input() yearsRange: [number, number];
  @ViewChild('fieldsDd') fieldsDropdown: TemplateRef<HTMLDivElement>;
  @ViewChild('dataTypeDd') dataTypeDropdown: TemplateRef<HTMLDivElement>;
  @ViewChild('timeRangeDd') timeRangeDropdown: TemplateRef<HTMLDivElement>;
  @ViewChild('tenureDd') tenureDropdown: TemplateRef<HTMLDivElement>;
  @ViewChild('rankDd') rankDropdown: TemplateRef<HTMLDivElement>;
  @ViewChild('ddOrigin') dropdownOrigin: ElementRef<HTMLButtonElement>;
  fieldOptions: SelectionOption[] = artHistoryFields.map((x) => {
    return { label: x.name.short, value: x.name.full };
  });
  dataTypeOptions: SelectionOption[] = valueTypeOptions;
  filterUseOptions = variableUseOptions;
  tenureValueOptions = tenureValueOptions;
  rankValueOptions = rankValueOptions;
  dropdownContent: BehaviorSubject<DropdownContent> =
    new BehaviorSubject<DropdownContent>({
      isOpen: false,
      content: null,
    });
  dropdownContent$ = this.dropdownContent.asObservable();
  backdropClickSubscription: Subscription;

  constructor(
    public dataService: ExploreDataService,
    private overlayService: OverlayService,
    private viewContainerRef: ViewContainerRef
  ) {
    super();
  }

  override ngOnDestroy(): void {
    super.ngOnDestroy();
    this.overlayService.destroyOverlay();
  }

  initializeDropdownOverlay(): void {
    if (this.backdropClickSubscription) {
      this.backdropClickSubscription.unsubscribe();
    }
    const config = this.overlayService.getOverlayConfig(
      new ConnectedOverlayConfig({
        scrollStrategy: 'close',
        panelClass: 'explore-dropdown',
        connectedElementRef: this.dropdownOrigin,
        positions: [belowLeftAligned, aboveLeftAligned],
      })
    );
    this.overlayService.createOverlay(config);
    this.backdropClickSubscription = this.overlayService.overlayRef
      .backdropClick()
      .subscribe((event: MouseEvent) => {
        if (event.target !== this.dropdownOrigin.nativeElement) {
          this.resetDropdownContent();
          this.overlayService.detachOverlay();
        }
      });
  }

  toggleOpenContent(
    selected: 'fields' | 'dataType' | 'timeRange' | 'tenure' | 'rank' | null
  ): void {
    if (
      selected === null ||
      this.dropdownContent.getValue().content === selected
    ) {
      this.resetDropdownContent();
      this.overlayService.detachOverlay();
    } else {
      const isOpen = this.dropdownContent.getValue().isOpen;
      if (!this.overlayService.overlayRef) {
        this.initializeDropdownOverlay();
      }
      if (isOpen) {
        this.overlayService.detachOverlay();
      }
      this.attachOverlay(selected);
      this.dropdownContent.next({
        isOpen: true,
        content: selected,
      });
    }
  }

  attachOverlay(
    selected: 'fields' | 'dataType' | 'timeRange' | 'tenure' | 'rank'
  ): void {
    let template;
    switch (selected) {
      case 'fields':
        template = this.fieldsDropdown;
        break;
      case 'dataType':
        template = this.dataTypeDropdown;
        break;
      case 'timeRange':
        template = this.timeRangeDropdown;
        break;
      case 'tenure':
        template = this.tenureDropdown;
        break;
      case 'rank':
        template = this.rankDropdown;
        break;
    }
    this.overlayService.attachTemplate(template, this.viewContainerRef);
  }

  closeDropdown(event: MouseEvent): void {
    if (
      !(event.target as HTMLElement).parentElement.classList.contains(
        'links-container'
      )
    ) {
      this.resetDropdownContent();
    }
  }

  resetDropdownContent(): void {
    console.log('resetting dropdown content', this.dropdownContent.getValue());
    this.dropdownContent.next({
      isOpen: false,
      content: null,
    });
  }
}
