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
  AlertController,
  IonText
} from '@ionic/angular/standalone';
import { RouterLink } from '@angular/router';
import { BrazeContentCard } from '@models/braze/braze-content-card';
import { select, Store } from '@ngxs/store';
import { ContentCardsState } from '../../state/contentCards.state';
import { ContentCardTapped, RemoveContentCard } from '../../state/contentCards.actions';
import { DatePipe } from '@angular/common';

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
        <ion-text color="medium">
          <p>{{ contentCard.cardDescription }}</p>
        </ion-text>
        <ion-text>
          <p>{{ contentCard.created * 1000 | date : 'dd.MM.yyyy hh:mm' }}</p>
        </ion-text>
      </app-mm-card>
      } } @else {
      <ion-text color="dark" class="ion-text-center">
        <p class="m-b-2">You're all caught up! No new notifications.</p>
      </ion-text>

      }
    </ion-content>
  `,
  styles: [``],
  imports: [
    MmCardComponent,
    IonHeader,
    RouterLink,
    IonToolbar,
    IonIcon,
    IonButton,
    IonTitle,
    IonContent,
    DatePipe,
    IonText
  ],
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
    const deleteAlert = await this.alertController.create({
      header: 'Delete Message',
      message: 'Are you sure you would like to delete this message?',
      mode: 'ios',
      cssClass: 'delete-message-alert',
      buttons: [
        {
          text: 'No',
          role: 'cancel'
        },
        {
          text: 'Yes',
          role: 'destructive',
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
