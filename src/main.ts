import { provideHttpClient } from '@angular/common/http';
import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter, withRouterConfig } from '@angular/router';
import { providePageResolver } from 'ngx-page-resolver';
import { provideNgxPageLoader } from 'projects/ngx-page-resolver/src/public-api';
import { AppComponent } from './app/app.component';

import { routes } from './app/routes';

bootstrapApplication(AppComponent, {
  providers: [
    provideHttpClient(),
    provideRouter(routes, withRouterConfig({
      onSameUrlNavigation: 'reload'
    })),
    providePageResolver(),
    provideNgxPageLoader(),
  ],
});
