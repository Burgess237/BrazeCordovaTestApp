import { Component, inject, NgZone } from '@angular/core';
import { IonApp, IonRouterOutlet } from '@ionic/angular/standalone';
import { App } from '@capacitor/app';
import { Router } from '@angular/router';
import { Store } from '@ngxs/store';
import { RefreshContentCards } from './shared/state/contentCards.actions';
import { Platform } from '@ionic/angular';
import { PushNotificationService } from '@services/push-notification.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  standalone: true,
  imports: [IonApp, IonRouterOutlet]
})
export class AppComponent {
  private zone = inject(NgZone);
  private router = inject(Router);
  private store = inject(Store);
  private plaform = inject(Platform);
  private pushNotificationService = inject(PushNotificationService);

  constructor() {
    this.pushNotificationService.init();
    App.addListener('appUrlOpen', (event: any) => {
      console.log('App URL Opened:', event);
      this.zone.run(() => {
        const url = new URL(event.url);
        console.log('App URL Opened:', url);
        if (url.protocol === 'za.co.mamamoney.assessments.frontend') {
          const path = url.hostname === 'complete' ? '/complete' : '/';
          this.router.navigate([path]);
        }
      });
    });

    this.plaform.ready().then(() => {
      this.store.dispatch(new RefreshContentCards());
    });
  }
}
