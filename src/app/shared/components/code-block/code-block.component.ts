import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit,
  ViewEncapsulation,
  WritableSignal,
  inject,
  signal,
} from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import {
  ShikiHighlighter,
  ShikiTheme,
} from '../../../core/services/highlighter.service';

@Component({
  selector: 'app-code-block',
  imports: [],
  templateUrl: './code-block.component.html',
  styleUrl: './code-block.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class CodeBlockComponent implements OnInit {
  @Input() code: string = '';
  @Input() language: string = 'typescript';
  @Input() theme: string = ShikiTheme.CatppuccinLatte;

  formattedCode: WritableSignal<string> = signal('');

  private highlighter = inject(ShikiHighlighter);
  private sanitizer = inject(DomSanitizer);

  async ngOnInit(): Promise<void> {
    const highlighterInstance = await this.highlighter.getHighlighter();
    const highlightedCode = highlighterInstance.codeToHtml(this.code, {
      lang: this.language,
      theme: this.theme,
    });
    this.formattedCode.set(
      this.sanitizer.bypassSecurityTrustHtml(highlightedCode) as string
    );
  }
}
