import { Injectable } from '@angular/core';
import {
  BundledLanguage,
  BundledTheme,
  createHighlighter,
  HighlighterGeneric,
} from 'shiki';

export interface ShikiHighlighterOptions {
  highlighter?: HighlighterGeneric<BundledLanguage, BundledTheme>;
  theme?: ShikiTheme;
  type?: 'html' | 'markdown';
  ignoreUnknownLanguage?: boolean;
}

export const defaultHighlighterLangs = [
  'json',
  'ts',
  'js',
  'html',
  'css',
  'scss',
  'yaml',
  'angular-html',
  'angular-ts',
  'mermaid',
  'bash',
];

export enum ShikiTheme {
  Andromeeda = 'andromeeda',
  AuroraX = 'aurora-x',
  AyuDark = 'ayu-dark',
  CatppuccinFrappe = 'catppuccin-frappe',
  CatppuccinLatte = 'catppuccin-latte',
  CatppuccinMacchiato = 'catppuccin-macchiato',
  CatppuccinMocha = 'catppuccin-mocha',
  DarkPlus = 'dark-plus',
  DraculaTheme = 'dracula',
  DraculaThemeSoft = 'dracula-soft',
  EverforestDark = 'everforest-dark',
  EverforestLight = 'everforest-light',
  GitHubDark = 'github-dark',
  GitHubDarkDefault = 'github-dark-default',
  GitHubDarkDimmed = 'github-dark-dimmed',
  GitHubDarkHighContrast = 'github-dark-high-contrast',
  GitHubLight = 'github-light',
  GitHubLightDefault = 'github-light-default',
  GitHubLightHighContrast = 'github-light-high-contrast',
  Houston = 'houston',
  LaserWave = 'laserwave',
  LightPlus = 'light-plus',
  MaterialTheme = 'material-theme',
  MaterialThemeDarker = 'material-theme-darker',
  MaterialThemeLighter = 'material-theme-lighter',
  MaterialThemeOcean = 'material-theme-ocean',
  MaterialThemePalenight = 'material-theme-palenight',
  MinDark = 'min-dark',
  MinLight = 'min-light',
  Monokai = 'monokai',
  NightOwl = 'night-owl',
  Nord = 'nord',
  OneDarkPro = 'one-dark-pro',
  OneLight = 'one-light',
  Plastic = 'plastic',
  Poimandres = 'poimandres',
  Red = 'red',
  RosePine = 'rose-pine',
  RosePineDawn = 'rose-pine-dawn',
  RosePineMoon = 'rose-pine-moon',
  SlackDark = 'slack-dark',
  SlackOchin = 'slack-ochin',
  SnazzyLight = 'snazzy-light',
  SolarizedDark = 'solarized-dark',
  SolarizedLight = 'solarized-light',
  Synthwave84 = 'synthwave-84',
  TokyoNight = 'tokyo-night',
  Vesper = 'vesper',
  VitesseBlack = 'vitesse-black',
  VitesseDark = 'vitesse-dark',
  VitesseLight = 'vitesse-light',
}

@Injectable({
  providedIn: 'root',
})
export class ShikiHighlighter {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private highlighterPromise: Promise<
    HighlighterGeneric<BundledLanguage, BundledTheme>
  > | null = null;

  /**
   * Initialize the highlighter. This should only be called one in an application.
   *
   * @param themes an array of any Shiki themes you may want to use anywhere in the app. You can control which theme for your particular parsing by passing the theme name to the actual parsing function.
   *
   * @returns void
   */
  async initialize(
    themes: ShikiTheme[],
    langs: string[] = defaultHighlighterLangs
  ): Promise<void> {
    if (!this.highlighterPromise) {
      this.highlighterPromise = createHighlighter({
        langs,
        themes: themes.length ? themes : [ShikiTheme.GitHubLight],
      });
    }
    await this.highlighterPromise;
  }

  async getHighlighter(): Promise<
    HighlighterGeneric<BundledLanguage, BundledTheme>
  > {
    if (!this.highlighterPromise) {
      throw new Error(
        'Highlighter is not initialized. Please call initialize() once in your application first.'
      );
    }
    return this.highlighterPromise;
  }
}
