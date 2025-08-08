import { Component, inject, NgZone } from '@angular/core';
import { IonApp, IonRouterOutlet } from '@ionic/angular/standalone';
import { PushNotificationService } from '@services/push-notification.service';
import { Platform } from '@ionic/angular';
import { App } from '@capacitor/app';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular/standalone';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  standalone: true,
  imports: [IonApp, IonRouterOutlet]
})
export class AppComponent {
  private zone = inject(NgZone);
  private router = inject(Router);
  private toastController = inject(ToastController);
  constructor() {
    App.addListener('appUrlOpen', (event: any) => {
      this.zone.run(() => {
        this.toast(event);
      });
    });
  }

  async toast(event: any) {
    const toast = await this.toastController.create({
      message: `${JSON.stringify(event)}`,
      duration: 1500,
      position: 'bottom'
    });

    await toast.present();
  }
}
