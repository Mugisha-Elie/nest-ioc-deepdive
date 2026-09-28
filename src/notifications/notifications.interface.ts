export interface INotificationService {
  send(recipient: string, message: string): void;
}

export const NOTIFICATION_SERVICE = Symbol('NOTIFICATION_SERVICE');