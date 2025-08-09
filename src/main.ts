import { bootstrapApplication } from '@angular/platform-browser';
import { RouteReuseStrategy, provideRouter, withPreloading, PreloadAllModules } from '@angular/router';
import { IonicRouteStrategy, provideIonicAngular } from '@ionic/angular/standalone';

import { routes } from './app/app.routes';
import { AppComponent } from './app/app.component';
import { provideHttpClient } from '@angular/common/http';
import { provideStore } from '@ngxs/store';
import { ContentCardsState } from './app/shared/state/contentCards.state';
import { withNgxsRouterPlugin } from '@ngxs/router-plugin';

bootstrapApplication(AppComponent, {
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    provideIonicAngular(),
    provideHttpClient(),
    provideStore([ContentCardsState], withNgxsRouterPlugin()),
    provideRouter(routes, withPreloading(PreloadAllModules))
  ]
});
