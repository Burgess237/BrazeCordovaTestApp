import { inject, Injectable } from '@angular/core';
import { BrazeContentCard } from '@models/braze/braze-content-card';
import { Action, Selector, State, StateContext } from '@ngxs/store';
import {
  ContentCardTapped,
  FetchContentCards,
  LogCustomEvent,
  PushNotificationActionPerformed,
  RefreshContentCards,
  RemoveContentCard
} from './contentCards.actions';
import { BrazeService } from '@services/braze.service';
import { Navigate } from '@ngxs/router-plugin';

interface ContentCardsStateModel {
  inboxContentCards: BrazeContentCard[];
}

@State<ContentCardsStateModel>({
  name: 'contentCards',
  defaults: {
    inboxContentCards: []
  }
})
@Injectable()
export class ContentCardsState {
  private brazeService = inject(BrazeService);

  @Selector()
  static contentCards(state: ContentCardsStateModel): BrazeContentCard[] {
    return state.inboxContentCards;
  }

  @Action(LogCustomEvent) logCustomEvent(ctx: StateContext<ContentCardsStateModel>, action: LogCustomEvent) {
    return this.brazeService.logCustomEvent(action.eventName, action.properties);
  }

  @Action(FetchContentCards)
  fetchContentCards(ctx: StateContext<ContentCardsStateModel>) {
    this.brazeService
      .getContentCards()
      .then((fetchedCards: BrazeContentCard[]) => {
        console.log('Fetched content cards:', fetchedCards),
          ctx.patchState({
            inboxContentCards: fetchedCards.filter((cards) => cards.extras.type === 'inbox')
          });
      })
      .catch((error) => {
        console.error('Error fetching content cards:', error);
      });
  }

  @Action(RefreshContentCards) refreshContentCards(ctx: StateContext<ContentCardsStateModel>) {
    return this.brazeService.requestContentCardsRefresh().then(() => {
      ctx.dispatch(new FetchContentCards());
    });
  }

  @Action(RemoveContentCard) removeContentCard(ctx: StateContext<ContentCardsStateModel>, action: RemoveContentCard) {
    const state = ctx.getState();
    const updatedCards = state.inboxContentCards.filter((card) => card.id !== action.cardId);
    this.brazeService
      .logContentCardDismissed(action.cardId)
      .then(() => {
        ctx.setState({
          ...state,
          inboxContentCards: updatedCards
        });
      })
      .catch((error) => {
        console.error('Error logging content card dismissal:', error);
      });
  }

  @Action(ContentCardTapped) contentCardTapped(ctx: StateContext<ContentCardsStateModel>, action: ContentCardTapped) {
    Promise.all([
      this.brazeService.logContentCardImpression(action.cardId),
      this.brazeService.logContentCardClicked(action.cardId)
    ])
      .then(() => {
        let cardUrl = ctx.getState().inboxContentCards.find((card) => card.id === action.cardId)?.url;
        if (cardUrl) {
          ctx.dispatch(new Navigate([`/${cardUrl.split('za.co.mamamoney.assessments.frontend://')[1]}`]));
        } else {
          ctx.dispatch(new Navigate(['/']));
        }
      })
      .catch((error) => {
        console.error('Error logging content card click:', error);
      });
  }

  @Action(PushNotificationActionPerformed) pushNotificationActionPerformed(ctx: StateContext<ContentCardsStateModel>) {
    ctx.dispatch(new Navigate(['/complete']));
  }
}
