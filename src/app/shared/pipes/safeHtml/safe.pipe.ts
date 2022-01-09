import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeHtml, SafeStyle, SafeScript, SafeUrl, SafeResourceUrl } from '@angular/platform-browser';

@Pipe({
    name: 'safe'
})
export class SafePipe implements PipeTransform {
    constructor(protected sanitizer: DomSanitizer) {}

    public transform(html: string): SafeHtml {
        return this.sanitizer.bypassSecurityTrustHtml(html);
    }
}
