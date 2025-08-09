export class FetchContentCards {
  static readonly type = '[ContentCards] Fetch Content Cards';
}

export class RefreshContentCards {
  static readonly type = '[ContentCards] Refresh Content Cards';
}

export class RemoveContentCard {
  static readonly type = '[Contentcards] Remove Content Card';
  constructor(public cardId: string) {}
}

export class ContentCardTapped {
  static readonly type = '[ContentCards] Content Card Tapped';
  constructor(public cardId: string) {}
}

export class LogCustomEvent {
  static readonly type = '[Braze] Log Custom Event';
  constructor(public eventName: string, public properties?: Record<string, any>) {}
}

export class PushNotificationActionPerformed {
  static readonly type = '[PushNotification] Action Performed';
}
