import { Inject, Injectable } from "@nestjs/common";
import { APP_CONFIG, AppConfig } from "./config/app-config.interface";

@Injectable()
export class UsersService {
  constructor(
    @Inject(APP_CONFIG) private readonly appConfig: AppConfig
  ) { }
  
  private readonly users = [
    { id: 1, name: 'Alice' },
    { id: 2, name: 'Bob' }
  ];

  findAll() {
    return {
      environment: this.appConfig.environment,
      apiPrefix: this.appConfig.apiPrefix,
      port: this.appConfig.port,
      users: this.users
    }
  }
}