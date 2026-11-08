import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class SvgIconService {
  private svgSprite: SVGElement | null = null;
  private isLoading = false;
  private loadPromise: Promise<SVGElement> | null = null;

  constructor(private http: HttpClient) {}

  loadSvgSprite(): Promise<SVGElement> {
    if (this.svgSprite) {
      return Promise.resolve(this.svgSprite);
    }

    if (this.isLoading) {
      return this.loadPromise!;
    }

    this.isLoading = true;
    this.loadPromise = new Promise((resolve, reject) => {
      this.http
        .get('assets/icons/sprite.svg', { responseType: 'text' })
        .subscribe({
          next: (svgText: string) => {
            const div = document.createElement('div');
            div.innerHTML = svgText;
            const svg = div.querySelector('svg');
            if (svg) {
              svg.style.display = 'none';
              document.body.appendChild(svg);
              this.svgSprite = svg;
              this.isLoading = false;
              resolve(svg);
            } else {
              reject('SVG sprite not found');
            }
          },
          error: (error) => {
            this.isLoading = false;
            reject(error);
          },
        });
    });

    return this.loadPromise;
  }
}
