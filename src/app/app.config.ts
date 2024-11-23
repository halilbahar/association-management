import { APP_INITIALIZER, ApplicationConfig, LOCALE_ID, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import '@angular/common/locales/global/de-AT';

import { routes } from './app.routes';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { providePrimeNG } from 'primeng/config';
import Aura from '@primeng/themes/aura';
import { DatabaseService } from '~services/database.service';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }), provideRouter(routes), provideAnimationsAsync(),
    providePrimeNG({
      theme: {
        preset: Aura,
        options: {
          cssLayer: {
            name: 'primeng',
            order: 'tailwind-base, primeng, tailwind-utilities'
          }
        }
      }
    }),
    {
      provide: APP_INITIALIZER,
      useFactory: (databaseService: DatabaseService) => () => databaseService.migrate(),
      multi: true,
      deps: [DatabaseService]
    },
    { provide: LOCALE_ID, useValue: 'de-AT' }
  ]
};
