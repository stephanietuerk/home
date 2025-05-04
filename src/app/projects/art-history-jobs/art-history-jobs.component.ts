import { Platform } from '@angular/cdk/platform';
import { CommonModule, DOCUMENT } from '@angular/common';
import {
  Component,
  ElementRef,
  Inject,
  OnInit,
  ViewChild,
} from '@angular/core';
import { fromEvent, takeUntil } from 'rxjs';
import {
  navbarHeight,
  projectNavbarId,
} from 'src/app/core/constants/dom.constants';
import { MessageService } from 'src/app/shared/components/messages/message.service';
import { OverlayService } from 'src/app/shared/components/overlay/overlay.service';
import { Unsubscribe } from 'src/app/viz-components/shared/unsubscribe.class';
import { ArtHistoryDataService } from './art-history-data.service';
import { currentDataYears } from './art-history-jobs.constants';
import { DataAcquisitionComponent } from './data-acquisition/data-acquisition.component';
import { ExploreDataService } from './explore/explore-data.service';
import { ExploreComponent } from './explore/explore.component';
import { SchoolsComponent } from './schools/schools.component';
import { SummaryComponent } from './summary/summary.component';

enum Section {
  intro = 'intro',
  summary = 'summary',
  jobCharacteristics = 'jobCharacteristics',
  schools = 'schools',
  methods = 'methods',
}

@Component({
  selector: 'app-art-history-jobs',
  standalone: true,
  imports: [
    CommonModule,
    SummaryComponent,
    ExploreComponent,
    SchoolsComponent,
    DataAcquisitionComponent,
  ],
  templateUrl: './art-history-jobs.component.html',
  styleUrls: ['./art-history-jobs.component.scss'],
  providers: [ExploreDataService, MessageService, OverlayService],
})
export class ArtHistoryJobsComponent extends Unsubscribe implements OnInit {
  @ViewChild('intro') intro: ElementRef;
  @ViewChild('summary', { read: ElementRef }) summary: ElementRef;
  @ViewChild('jobCharacteristics', { read: ElementRef })
  jobCharacteristics: ElementRef;
  @ViewChild('schools', { read: ElementRef }) schools: ElementRef;
  @ViewChild('methods', { read: ElementRef }) methods: ElementRef;
  dataYears = currentDataYears;
  scrollEl: HTMLElement;
  currentSection: keyof typeof Section = 'intro';

  constructor(
    public mainDataService: ArtHistoryDataService,
    public exploreDataService: ExploreDataService,
    private platform: Platform,
    private messages: MessageService,
    @Inject(DOCUMENT) private document: Document
  ) {
    super();
  }

  ngOnInit(): void {
    this.mainDataService.init().then(() => {
      this.exploreDataService.init();
    });
    this.setScrollListener();
    if (this.platform.IOS || this.platform.ANDROID) {
      this.displayMobileMessage();
    }
  }

  setScrollListener(): void {
    this.scrollEl = this.document.querySelector(
      `#${projectNavbarId}`
    ).parentElement;

    fromEvent(this.scrollEl, 'scrollend')
      .pipe(takeUntil(this.unsubscribe))
      .subscribe((event) => {
        this.handleScrollEnd(event);
      });
  }

  handleScrollEnd(event: Event): void {
    const scrollEl = event.target as HTMLElement;
    const scrollPosition = scrollEl.scrollTop;
    const sections = Object.keys(Section) as (keyof typeof Section)[];
    const sectionOffsets = sections.map(
      (section) => this[section].nativeElement.offsetTop - 20 - navbarHeight
    );
    const currentSectionIndex = sectionOffsets.findIndex(
      (offset) => offset > scrollPosition
    );
    if (currentSectionIndex === -1) {
      this.currentSection = sections[sections.length - 1];
    } else if (currentSectionIndex === 0) {
      this.currentSection = sections[0];
    } else {
      this.currentSection = sections[currentSectionIndex - 1];
    }
  }

  scrollTo(element: keyof typeof Section): void {
    const sectionOffsetTop = this[element].nativeElement.offsetTop;
    const offsetTop = sectionOffsetTop - 20 - navbarHeight;
    this.scrollEl.scrollTo({ behavior: 'smooth', top: offsetTop });
  }

  jumpToNext(): void {
    const sections = Object.keys(Section) as (keyof typeof Section)[];
    const currentSectionIndex = sections.indexOf(this.currentSection);
    const nextSection = sections[currentSectionIndex + 1];
    this.scrollTo(nextSection);
  }

  jumpToPrevious(): void {
    const sections = Object.keys(Section) as (keyof typeof Section)[];
    const currentSectionIndex = sections.indexOf(this.currentSection);
    const previousSection = sections[currentSectionIndex - 1];
    this.scrollTo(previousSection);
  }

  displayMobileMessage(): void {
    this.messages.createGlobalMessage([
      'Hello!',
      'It looks like you are viewing this project on a mobile device.',
      "This site will work on mobile, but the layout is not optimal for exploring lots of data. Additionally, since this is a side project, I'm choosing not to spend time to get all features to 100% on a mobile device.",
      'For a better experience, please view this site on a desktop/laptop.',
    ]);
  }
}
