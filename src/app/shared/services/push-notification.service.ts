import { inject, Injectable } from '@angular/core';
import { BrazePushNotification, BrazeParsedExtra } from '@models/braze/braze-push-notification';
import { ActionPerformed, PushNotifications, PushNotificationSchema } from '@capacitor/push-notifications';
import { Store } from '@ngxs/store';
import { ContentCardTapped, RefreshContentCards } from '../state/contentCards.actions';

@Injectable({
  providedIn: 'root'
})
export class PushNotificationService {
  private store = inject(Store);

  async init() {
    //All documention says this need to be at the end, but it only works when it's here.

    await this.registerPush();
    PushNotifications.addListener('registration', (token) => {
      console.log('~ PushNotificationService ~ token:', token);
    });

    await PushNotifications.addListener(
      'pushNotificationReceived',
      (notification: PushNotificationSchema | BrazePushNotification) => {
        console.log('~ PushNotificationService ~ notification:', notification);
        const brazePushNotification = notification as BrazePushNotification;
        if (brazePushNotification.data?.extra) {
          try {
            const extras = JSON.parse(brazePushNotification.data.extra) as BrazeParsedExtra;
            if (extras.type === 'inbox') {
              this.store.dispatch(new RefreshContentCards());
            }
          } catch (error) {
            console.error('Error parsing Braze push notification extras:', error);
          }
        }
      }
    );

    await PushNotifications.addListener('pushNotificationActionPerformed', (notification: ActionPerformed) => {
      console.log('~ PushNotificationService ~ pushNotificationActionPerformed:', JSON.stringify(notification));
      const brazePushNotification = notification.notification as BrazePushNotification;
      if (brazePushNotification.data?.extra) {
        try {
          const extras = JSON.parse(brazePushNotification.data.extra) as BrazeParsedExtra;
          if (extras.type === 'inbox') {
            //This is the same as if we'd opened it in the app and then tapped it
            this.store.dispatch(new RefreshContentCards());
            this.store.dispatch(new ContentCardTapped(brazePushNotification.id));
          }
        } catch (error) {
          console.error('Error parsing Braze push notification extras on action:', error);
        }
      }
    });
  }

  async registerPush(): Promise<void> {
    let pushReq = await PushNotifications.checkPermissions();

    if (pushReq.receive === 'prompt') {
      pushReq = await PushNotifications.requestPermissions();
    }

    if (pushReq.receive) {
      // Ask iOS user for permission/auto grant android permission
      await PushNotifications.register();
    }
  }
}
