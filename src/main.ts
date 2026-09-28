import 'reflect-metadata'
import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { UsersService } from './users.service';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);
  console.log('=== NestJS IoC Engine Initilized Successfully ===');

  const usersService1 = app.get(UsersService);
  const usersService2 = app.get(UsersService);

  console.log('Users found:', usersService1.findAll());
  console.log('Is UsersService a singleton?:', usersService1 === usersService2);
  
  await app.close();
}

bootstrap();