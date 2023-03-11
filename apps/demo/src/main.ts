import { provideHttpClient } from '@angular/common/http';
import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter, withRouterConfig } from '@angular/router';
import { provideNgxPageLoader } from 'ngx-page-loader';
import { AppComponent } from './app/app.component';
import { routes } from './app/routes';

bootstrapApplication(AppComponent, {
  providers: [
    provideHttpClient(),
    provideRouter(
      routes,
      withRouterConfig({
        onSameUrlNavigation: 'reload',
      })
    ),
    provideNgxPageLoader(),
  ],
});
