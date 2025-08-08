import { Component, input, output } from '@angular/core';
import { ImageLoaderComponent } from '@components/image-loader/image-loader.component';
import {
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonImg,
  IonIcon,
  IonButton
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { closeCircleOutline } from 'ionicons/icons';

@Component({
  selector: 'app-mm-card',
  template: ` <ion-card class="ion-no-padding">
    <ion-card-header>
      @if (title(); as title) {
      <ion-card-title>
        <div class="flex-row align-items-center" [class]="showDelete() ? 'justify-content-between' : ''">
          @if(showIcon()) {
          <div class="m-r-1">
            <app-image-loader
              src="assets/icon/mm-cc-logo.png"
              imageClass="iconize"
              maxWidth="30px"
              skeletonDiameter="30px"
              skeletonBorderRadius="30px"
            ></app-image-loader>
          </div>
          } {{ title }}
          @if(showDelete()) {
          <ion-button fill="clear" class="m-l-2" (click)="onDeleteClick($event)">
            <ion-icon slot="icon-only" name="close-circle-outline" color="danger"></ion-icon>
          </ion-button>
          }
        </div>
      </ion-card-title>
      }
    </ion-card-header>

    <ion-card-content>
      <ng-content></ng-content>
    </ion-card-content>
  </ion-card>`,
  styles: [],
  standalone: true,
  imports: [IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonImg, ImageLoaderComponent, IonIcon, IonButton]
})
export class MmCardComponent {
  title = input('Mama Money');
  showIcon = input(true);
  showDelete = input(false);
  onDelete = output<Event>();

  constructor() {
    addIcons({ closeCircleOutline });
  }

  onDeleteClick($event: Event) {
    this.onDelete.emit($event);
  }
}
