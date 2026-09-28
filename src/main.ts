import 'reflect-metadata'
import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { UsersService } from './users.service';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);
  console.log('=== NestJS IoC Engine Initilized Successfully ===');

  const usersService1 = app.get(UsersService);
  const usersService2 = app.get(UsersService);

  const result = await usersService1.findAll();

  console.log('Users found:', await usersService1.findAll());
  console.log('Is UsersService a singleton?:', usersService1 === usersService2);

  console.log('Result:', result);
  
  await app.close();
}

bootstrap();