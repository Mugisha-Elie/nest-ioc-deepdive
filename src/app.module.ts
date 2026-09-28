import { Module } from "@nestjs/common";
import { UsersService } from "./users.service";
import { APP_CONFIG, AppConfig } from "./config/app-config.interface";

const configValues: AppConfig = {
  environment: 'development',
  apiPrefix: 'api/v1',
  port: 4000,
}

@Module({
  imports: [],
  controllers: [],
  providers: [UsersService, {provide: APP_CONFIG, useValue: configValues}]
})
export class AppModule {}