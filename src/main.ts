import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter, withRouterConfig } from '@angular/router';
import { providePageResolver } from 'ngx-page-resolver';
import { AppComponent } from './app/app.component';

import { routes } from './app/routes';

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(routes, withRouterConfig({
      onSameUrlNavigation: 'reload'
    })),
    providePageResolver()
  ],
});
