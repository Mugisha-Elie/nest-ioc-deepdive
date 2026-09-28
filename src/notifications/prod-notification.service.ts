import { Injectable } from "@nestjs/common";
import { INotificationService } from "./notifications.interface";

@Injectable()
export class ProdNotificationService implements INotificationService {
  send(recipient: string, message: string): void {
    console.log(`[PROD ALERT] Dispatched encrypted payload to ${recipient}: "${message}"`);
  }
}