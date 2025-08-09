import { Component, inject } from '@angular/core';
import { MmCardComponent } from '../mm-card/mm-card.component';
import {
  IonHeader,
  IonToolbar,
  IonIcon,
  IonButton,
  IonTitle,
  ModalController,
  IonContent,
  AlertController
} from '@ionic/angular/standalone';
import { Router, RouterLink } from '@angular/router';
import { BrazeContentCard } from '@models/braze/braze-content-card';
import { select, Store } from '@ngxs/store';
import { ContentCardsState } from '../../state/contentCards.state';
import { ContentCardTapped, RemoveContentCard } from '../../state/contentCards.actions';

@Component({
  selector: 'app-inbox-modal',
  template: `
    <ion-header mode="ios" class="ion-no-border">
      <ion-toolbar>
        <ion-button class="back-btn" (click)="back()" fill="clear" slot="start">
          <ion-icon color="dark" name="arrow-back" slot="icon-only"></ion-icon>
        </ion-button>

        <ion-title> Notifications </ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content [fullscreen]="true" class="ion-padding">
      @if(contentCards().length > 0) { @for(contentCard of contentCards(); track contentCard.id) {
      <app-mm-card
        [title]="contentCard.title ?? ''"
        [showIcon]="true"
        [routerLink]="['complete']"
        (click)="cardClick(contentCard)"
        (onDelete)="onDelete($event, contentCard)"
        [showDelete]="true"
      >
        <p class="m-b-2">{{ contentCard.cardDescription }}</p>
      </app-mm-card>
      } } @else {
      <p class="m-b-2">You're all caught up! No new notifications.</p>
      }
    </ion-content>
  `,
  styles: [``],
  imports: [MmCardComponent, IonHeader, RouterLink, IonToolbar, IonIcon, IonButton, IonTitle, IonContent],
  standalone: true
})
export class InboxModalComponent {
  private modalController = inject(ModalController);
  private alertController = inject(AlertController);
  private store = inject(Store);
  contentCards = select(ContentCardsState.contentCards);

  constructor() {}

  cardClick(contentCard: BrazeContentCard): void {
    this.store.dispatch(new ContentCardTapped(contentCard.id)).subscribe((res) => {
      this.modalController.dismiss();
    });
  }

  async onDelete($event: Event, contentCard: BrazeContentCard) {
    $event.stopPropagation();
    //Show Popup
    const deleteAlert = await this.alertController.create({
      header: 'Delete Message',
      message: 'Are you sure you would like to delete this message?',
      buttons: [
        'No',
        {
          text: 'yes',
          handler: () => {
            this.store.dispatch(new RemoveContentCard(contentCard.id));
          }
        }
      ]
    });

    await deleteAlert.present();
  }

  back() {
    this.modalController.dismiss();
  }
}
