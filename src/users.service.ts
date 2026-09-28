import { Inject, Injectable } from "@nestjs/common";
import { APP_CONFIG, AppConfig } from "./config/app-config.interface";
import { INotificationService, NOTIFICATION_SERVICE } from "./notifications/notifications.interface";

@Injectable()
export class UsersService {
  constructor(
    @Inject(APP_CONFIG) private readonly appConfig: AppConfig,
    @Inject(NOTIFICATION_SERVICE) private readonly notifier: INotificationService,
  ) { }
  
  private readonly users = [
    { id: 1, name: 'Alice' },
    { id: 2, name: 'Bob' }
  ];

  findAll() {
    this.notifier.send('admin@system.local', 'Users list required');
    return {
      environment: this.appConfig.environment,
      apiPrefix: this.appConfig.apiPrefix,
      port: this.appConfig.port,
      users: this.users
    }
  }
}