import { Module } from "@nestjs/common";
import { UsersService } from "./users.service";
import { APP_CONFIG, AppConfig } from "./config/app-config.interface";
import { NOTIFICATION_SERVICE } from "./notifications/notifications.interface";
import { ProdNotificationService } from "./notifications/prod-notification.service";
import { DevNotificationService } from "./notifications/dev-notification.service";
import { DATABASE_CONNECTION, SimulatedDbPool } from "./database/database-connection";

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
    { provide: NOTIFICATION_SERVICE, useClass: selectedNotifierClass },
    {
      provide: DATABASE_CONNECTION,
      inject: [APP_CONFIG],
      useFactory: async (config: AppConfig) => {
        console.log('[useFactory]: Establishing async database connection pool...');
        await new Promise((resolve) => setTimeout(resolve, 500))
        const uri = `postgres://app_user:secret@localhost:${config.port}/users_db`;
        console.log(`[useFactory]: Connected cleanly to ${uri}`);

        return new SimulatedDbPool(uri);
      }
    }
  ]
})
export class AppModule {}