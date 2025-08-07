import { inject, Injectable } from '@angular/core';
import { BrazePushNotification } from '@models/braze/braze-push-notification';
import { PushNotifications, PushNotificationSchema } from '@capacitor/push-notifications';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class PushNotificationService {
  private httpClient = inject(HttpClient);

  init() {
    PushNotifications.addListener('registration', (token) => {
      console.log('~ PushNotificationService ~ token:', token);
    });

    PushNotifications.addListener(
      'pushNotificationReceived',
      (notification: PushNotificationSchema | BrazePushNotification) => {
        // TODO: Implement content card checking functionality when receiving Braze push notification with type === 'inbox' in "Extra's"
      }
    );

    this.registerPush();
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

  sendPushNotification(notification: any): void {
    const url = 'https://sdk.iad-07.braze.com/api/v3/messages/send';
    const body = {
      messages: {
        push: {
          alert: 'You have a new message!',
          title: 'Hello from Angular!',
          external_user_ids: ['user123'],
          platform: 'android' // or "ios"
        }
      }
    };

    const headers = {
      'Content-Type': 'application/json',
      Authorization: 'Bearer 99548b24-d0f7-4a17-b8f5-ac6861a844dd'
    };

    this.httpClient.post(url, body, { headers }).subscribe({
      next: (res) => console.log('Sent notification!', res),
      error: (err) => console.error('Error sending notification', err)
    });
  }
}
