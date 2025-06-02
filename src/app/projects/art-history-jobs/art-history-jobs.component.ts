import { Platform } from '@angular/cdk/platform';
import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  Component,
  DestroyRef,
  ElementRef,
  inject,
  OnInit,
  ViewChild,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { BehaviorSubject, fromEvent } from 'rxjs';
import { projectNavbarHeight } from 'src/app/core/constants/dom.constants';
import { MessageService } from 'src/app/shared/components/messages/message.service';
import { OverlayService } from '../../shared/components/overlay/overlay.service';
import { SvgIconComponent } from '../../shared/components/svg-icon/svg-icon.component';
import { ArtHistoryDataService } from './art-history-data.service';
import { currentDataYears } from './art-history-jobs.constants';
import { DataAcquisitionComponent } from './data-acquisition/data-acquisition.component';
import { ExploreDataService } from './explore/explore-data.service';
import { ExploreComponent } from './explore/explore.component';
import { SchoolsDataService } from './schools/schools-data.service';
import { SchoolsComponent } from './schools/schools.component';
import { SummaryComponent } from './summary/summary.component';

enum ArtHistorySection {
  intro = 'intro',
  summary = 'summary',
  jobCharacteristics = 'jobCharacteristics',
  schools = 'schools',
  methods = 'methods',
}

@Component({
  selector: 'app-art-history-jobs',
  imports: [
    CommonModule,
    SummaryComponent,
    ExploreComponent,
    SchoolsComponent,
    DataAcquisitionComponent,
    SvgIconComponent,
  ],
  templateUrl: './art-history-jobs.component.html',
  styleUrls: ['./art-history-jobs.component.scss'],
  providers: [ExploreDataService, MessageService, OverlayService],
})
export class ArtHistoryJobsComponent implements OnInit, AfterViewInit {
  @ViewChild('intro') intro: ElementRef;
  @ViewChild('summary', { read: ElementRef }) summary: ElementRef;
  @ViewChild('jobCharacteristics', { read: ElementRef })
  jobCharacteristics: ElementRef;
  @ViewChild('schools', { read: ElementRef }) schools: ElementRef;
  @ViewChild('methods', { read: ElementRef }) methods: ElementRef;
  dataYears = currentDataYears;
  currentSectionName = new BehaviorSubject<keyof typeof ArtHistorySection>(
    'intro'
  );
  currentSectionName$ = this.currentSectionName.asObservable();
  private destroyRef = inject(DestroyRef);
  sections: { name: keyof typeof ArtHistorySection; el: HTMLElement }[] = [];
  sectionNames = Object.keys(ArtHistorySection);

  constructor(
    public mainDataService: ArtHistoryDataService,
    public exploreDataService: ExploreDataService,
    private schoolsDataService: SchoolsDataService,
    private platform: Platform,
    private messages: MessageService
  ) {}

  ngOnInit(): void {
    this.mainDataService.init().then(() => {
      this.exploreDataService.init();
    });
    this.schoolsDataService.init();
    if (this.platform.IOS || this.platform.ANDROID) {
      this.displayMobileMessage();
    }
  }

  ngAfterViewInit(): void {
    this.sections = Object.keys(ArtHistorySection).map((section) => {
      return {
        name: section as keyof typeof ArtHistorySection,
        el: this[section].nativeElement,
      };
    });
    this.setScrollListener();
  }

  setScrollListener(): void {
    fromEvent(window, 'scrollend')
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        this.setActiveSection();
      });
  }

  setActiveSection(): void {
    this.currentSectionName.next(this.findActiveSection());
  }

  private findActiveSection(): keyof typeof ArtHistorySection | null {
    const scrollPosition = window.scrollY;
    for (let i = this.sections.length - 1; i >= 0; i--) {
      const heading = this.sections[i];
      if (heading.el.offsetTop <= scrollPosition + projectNavbarHeight + 20) {
        return heading.name;
      }
    }
    return this.sections[0].name || null;
  }

  jumpToNext(): void {
    const currentSectionIndex = this.sections.findIndex(
      (x) => x.name === this.currentSectionName.value
    );
    const nextSection = this.sections[currentSectionIndex + 1];
    // handle fast clicking
    if (nextSection) {
      this.scrollTo(nextSection.name);
    }
  }

  jumpToPrevious(): void {
    const currentSectionIndex = this.sections.findIndex(
      (x) => x.name === this.currentSectionName.value
    );
    const previousSection = this.sections[currentSectionIndex - 1];
    // handle fast clicking
    if (previousSection) {
      this.scrollTo(previousSection.name);
    }
  }

  scrollTo(section: keyof typeof ArtHistorySection): void {
    const sectionOffsetTop = this.sections.find((x) => x.name === section).el
      .offsetTop;
    const offsetTop = sectionOffsetTop - projectNavbarHeight + 60; // account for top padding of section and offset
    window.scrollTo({ behavior: 'smooth', top: offsetTop });
    this.currentSectionName.next(section);
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
