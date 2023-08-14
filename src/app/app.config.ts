import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';

import { provideHttpClient } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule, provideNoopAnimations } from '@angular/platform-browser/animations';
import { routes } from '@core/routes/app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(),
    BrowserModule,
    BrowserAnimationsModule,
    { provide: 'LOCALSTORAGE', useFactory: getLocalStorage },
    provideNoopAnimations()
  ],
};

function getLocalStorage() {
  return typeof window !== 'undefined' ? window.localStorage : null;
}
