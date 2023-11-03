import { TestBed } from '@angular/core/testing';
import { DomSanitizer } from '@angular/platform-browser';
import { DomSanitizerStub } from 'src/app/testing/stubs/dom-sanitizer.stub';
import { SafePipe } from './safe.pipe';

describe('SafePipe', () => {
  let pipe: SafePipe;
  let domsanitizerStub: DomSanitizerStub;

  beforeEach(() => {
    domsanitizerStub = new DomSanitizerStub();

    TestBed.configureTestingModule({
      declarations: [SafePipe],
      providers: [
        SafePipe,
        { provide: DomSanitizer, useValue: domsanitizerStub },
      ],
    });
    pipe = TestBed.inject(SafePipe);
  });

  it('calls bypassSecurityTrustHtml', () => {
    const html = '<a></a>';
    pipe.transform(html);
    expect(domsanitizerStub.bypassSecurityTrustHtml).toHaveBeenCalledTimes(1);
    expect(domsanitizerStub.bypassSecurityTrustHtml).toHaveBeenCalledWith(html);
  });
});
