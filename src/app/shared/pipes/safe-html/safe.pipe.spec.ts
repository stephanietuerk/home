import { TestBed } from '@angular/core/testing';
import { DomSanitizer } from '@angular/platform-browser';
import { DomSanitizerStub } from 'src/app/testing/stubs/angular/dom-sanitizer.stub';
import { SafePipe } from './safe.pipe';

describe('SafePipe', () => {
  let pipe: SafePipe;
  let domSanitizerStub: DomSanitizerStub;

  beforeEach(() => {
    domSanitizerStub = new DomSanitizerStub();

    TestBed.configureTestingModule({
      declarations: [SafePipe],
      providers: [
        SafePipe,
        { provide: DomSanitizer, useValue: domSanitizerStub },
      ],
    });
    pipe = TestBed.inject(SafePipe);
  });

  it('calls bypassSecurityTrustHtml', () => {
    const html = '<a></a>';
    pipe.transform(html);
    expect(domSanitizerStub.bypassSecurityTrustHtml).toHaveBeenCalledTimes(1);
    expect(domSanitizerStub.bypassSecurityTrustHtml).toHaveBeenCalledWith(html);
  });
});
