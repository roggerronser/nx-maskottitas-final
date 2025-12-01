import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { appRoutes } from './app/app.routes';
import { App } from './app/app';
bootstrapApplication(App, {
  providers: [provideRouter(appRoutes), provideHttpClient()],
});
