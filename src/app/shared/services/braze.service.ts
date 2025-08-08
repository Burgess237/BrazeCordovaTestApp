import { Injectable } from '@angular/core';
import { Platform } from '@ionic/angular';
import { BrazeContentCard } from '@models/braze/braze-content-card';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BrazeService {
  plugin: any;
  private contentCards = new BehaviorSubject<BrazeContentCard[]>([]);
  readonly contentCard$ = this.contentCards.asObservable();

  constructor(private platform: Platform) {
    this.platform.ready().then(() => {
      this.plugin = (window as any).BrazePlugin;
      console.log('Braze plugin loaded:', !!this.plugin);
      console.log(new Date().toISOString());
    });
  }

  /**
   * Initialize Braze SDK
   */
  async initialize(): Promise<void> {
    return new Promise((resolve, reject) => {
      console.log((window as any).BrazePlugin);
      if (!this.plugin) {
        resolve();
        return;
      }

      try {
        resolve();
      } catch (error) {
        reject(error);
      }
    });
  }

  /**
   * Log a custom event to Braze
   */
  async logCustomEvent(eventName: string, properties?: { [key: string]: any }): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!this.plugin) {
        resolve();
        return;
      }

      try {
        this.plugin.logCustomEvent(
          eventName,
          properties || {},
          () => {
            // Request immediate data flush to ensure event is sent
            this.plugin.requestImmediateDataFlush();
            resolve();
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

  /**
   * Request fresh content cards from Braze
   */
  async requestContentCardsRefresh(): Promise<void> {
    if (!this.plugin) {
      return;
    }

    try {
      this.plugin.requestContentCardsRefresh();
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get cached content cards from Braze
   */
  async getContentCards(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!this.plugin) {
        resolve();
        return;
      }

      try {
        this.plugin.getContentCardsFromCache(
          (contentCards: BrazeContentCard[]) => {
            console.log(contentCards);
            this.contentCards.next(contentCards.filter((cards) => cards.extras.type === 'inbox') || []);
            resolve();
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

  /**
   * Log content card impression
   */
  async logContentCardImpression(cardId: string): Promise<void> {
    if (!this.plugin) {
      return;
    }

    try {
      this.plugin.logContentCardImpression(cardId);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Log content card click
   */
  async logContentCardClicked(cardId: string): Promise<void> {
    if (!this.plugin) {
      return;
    }

    try {
      this.plugin.logContentCardClicked(cardId);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Log content card dismissal
   */
  async logContentCardDismissed(cardId: string): Promise<void> {
    if (!this.plugin) {
      return;
    }

    try {
      this.plugin.logContentCardDismissed(cardId);
    } catch (error) {
      throw error;
    }
  }
}
