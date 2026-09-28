import { Module } from "@nestjs/common";
import { UsersService } from "./users.service";
import { APP_CONFIG, AppConfig } from "./config/app-config.interface";
import { NOTIFICATION_SERVICE } from "./notifications/notifications.interface";
import { ProdNotificationService } from "./notifications/prod-notification.service";
import { DevNotificationService } from "./notifications/dev-notification.service";

const configValues: AppConfig = {
  environment: 'development',
  apiPrefix: 'api/v1',
  port: 4000,
}

const selectedNotifierClass = 
  configValues.environment === 'production'
    ? ProdNotificationService
    : DevNotificationService


@Module({
  imports: [],
  controllers: [],
  providers: [
    UsersService,
    { provide: APP_CONFIG, useValue: configValues },
    { provide: NOTIFICATION_SERVICE, useClass: selectedNotifierClass }
  ]
})
export class AppModule {}