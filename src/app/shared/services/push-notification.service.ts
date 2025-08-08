import { inject, Injectable, signal } from '@angular/core';
import { BrazePushNotification, BrazeParsedExtra } from '@models/braze/braze-push-notification';
import { PushNotifications, PushNotificationSchema } from '@capacitor/push-notifications';
import { HttpClient } from '@angular/common/http';
import { BrazeService } from './braze.service';

@Injectable({
  providedIn: 'root'
})
export class PushNotificationService {
  readonly pushNotifications = signal<any[]>([]);
  private brazeService = inject(BrazeService);

  init() {
    PushNotifications.addListener('registration', (token) => {
      console.log('~ PushNotificationService ~ token:', token);
    });

    PushNotifications.addListener(
      'pushNotificationReceived',
      (notification: PushNotificationSchema | BrazePushNotification) => {
        console.log('~ PushNotificationService ~ notification:', notification);
        const brazePushNotification = notification as BrazePushNotification;
        if (brazePushNotification.data?.extra) {
          try {
            const extras = JSON.parse(brazePushNotification.data.extra) as BrazeParsedExtra;
            if (extras.type === 'inbox') {
              this.pushNotifications.update((prev) => [...prev, brazePushNotification]);
            }
          } catch (error) {
            console.error('Error parsing Braze push notification extras:', error);
          }
        }
      }
    );

    this.registerPush();
    this.brazeService
      .initialize()
      .then(() => {
        console.log('Braze service initialized');
      })
      .catch((error) => {
        console.error('Error initializing Braze service:', error);
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
