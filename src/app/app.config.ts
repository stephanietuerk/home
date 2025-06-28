import {
  provideHttpClient,
  withInterceptorsFromDi,
} from '@angular/common/http';
import {
  ApplicationConfig,
  inject,
  provideAppInitializer,
} from '@angular/core';
import { provideAnalytics } from '@angular/fire/analytics';
import { provideFirebaseApp } from '@angular/fire/app';
import { provideFirestore } from '@angular/fire/firestore';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideRouter, withInMemoryScrolling } from '@angular/router';
import { getAnalytics } from 'firebase/analytics';
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { environment } from '../environments/environment';
import { APP_ROUTES } from './app.routes';
import {
  ShikiHighlighter,
  ShikiTheme,
} from './core/services/highlighter.service';

export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(withInterceptorsFromDi()),
    provideRouter(
      APP_ROUTES,
      withInMemoryScrolling({
        scrollPositionRestoration: 'enabled',
        anchorScrolling: 'enabled',
      })
    ),
    provideAppInitializer(() => {
      const initializerFn = ((highlighter: ShikiHighlighter) => {
        return () =>
          highlighter.initialize([
            ShikiTheme.GitHubLight,
            ShikiTheme.CatppuccinLatte,
            ShikiTheme.LightPlus,
            ShikiTheme.SlackOchin,
            ShikiTheme.SnazzyLight,
          ]);
      })(inject(ShikiHighlighter));
      return initializerFn();
    }),
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideFirestore(() => getFirestore()),
    provideAnalytics(() => getAnalytics()),
    provideAnimations(),
  ],
};
