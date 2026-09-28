import { Injectable } from "@nestjs/common";
import { INotificationService } from "./notifications.interface";

@Injectable()
export class DevNotificationService implements INotificationService {
  send(recipient: string, message: string): void {
    console.log(`[DEV MODE NOTIFICATION] Simulated message to ${recipient}: "${message}"`);
  }
}