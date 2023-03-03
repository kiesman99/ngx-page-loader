import { provideHttpClient } from '@angular/common/http';
import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter, withRouterConfig } from '@angular/router';
import { providePageResolver, provideNgxPageLoader } from 'ngx-page-resolver';
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
