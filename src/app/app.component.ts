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
  private store = inject(Store);
  private plaform = inject(Platform);
  private pushNotificationService = inject(PushNotificationService);
  private router = inject(Router);
  constructor() {
    this.pushNotificationService.init();
    this.plaform.ready().then(() => {
      this.store.dispatch(new RefreshContentCards());
    });
    App.addListener('appUrlOpen', (data: any) => {
      let url = data.url.split('za.co.mamamoney.assessments.frontend://')[1];
      if (url === 'inbox') {
        this.router.navigate(['complete']);
      }
    });
  }
}
