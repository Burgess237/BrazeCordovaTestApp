import { Injectable } from '@angular/core';
import { Platform } from '@ionic/angular';
import { BrazeContentCard } from '@models/braze/braze-content-card';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BrazeService {
  plugin: any;

  constructor(private platform: Platform) {
    this.platform.ready().then(() => {
      this.plugin = (window as any).BrazePlugin;
      console.log('Braze plugin loaded:', !!this.plugin);
    });
  }

  async logCustomEvent(eventName: string, properties?: { [key: string]: any }): Promise<boolean> {
    return await this.plugin.logCustomEvent(
      eventName,
      properties || {},
      () => {
        this.plugin.requestImmediateDataFlush();
      },
      (error: any) => {
        console.log(error);
      }
    );
  }

  async requestContentCardsRefresh(): Promise<boolean> {
    return await this.plugin.requestContentCardsRefresh();
  }

  async getContentCards(): Promise<BrazeContentCard[]> {
    return new Promise((resolve, reject) => {
      try {
        this.plugin.getContentCardsFromCache(
          (contentCards: BrazeContentCard[]) => {
            resolve(contentCards || []);
          },
          (error: any) => {
            reject(error);
          }
        );
      } catch (error) {
        reject(error);
      }
    });
  }

  async logContentCardImpression(cardId: string): Promise<boolean> {
    return await this.plugin.logContentCardImpression(cardId);
  }

  async logContentCardClicked(cardId: string): Promise<boolean> {
    return this.plugin.logContentCardClicked(cardId);
  }

  async logContentCardDismissed(cardId: string): Promise<boolean> {
    return this.plugin.logContentCardDismissed(cardId);
  }
}
