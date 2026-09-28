import 'reflect-metadata'
import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { UsersService } from './users.service';
import { AppDatabaseService } from './database/app-database.service';
import { IDatabaseConnection } from './database/database-connection';
import { DATABASE_READER, IDatabaseReader } from './database/reader.interface';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);
  console.log('=== NestJS IoC Engine Initilized Successfully ===');

  const usersService1 = app.get(UsersService);
  const usersService2 = app.get(UsersService);

  const result = await usersService1.findAll();

  console.log('Users found:', await usersService1.findAll());
  console.log('Is UsersService a singleton?:', usersService1 === usersService2);

  console.log('Result:', result);

  const primaryDb = app.get(AppDatabaseService);
  const readerDb = app.get<IDatabaseReader>(DATABASE_READER);

  console.log('--- Testing useExisting Alias ---');
  console.log('Primary DB result:', await primaryDb.write('USER_CREATED'));
  console.log('Reader DB result: ', await readerDb.read('SELECT * FROM audit_logs'));

  console.log('Are both references strictly identical?:', primaryDb === readerDb);
  
  await app.close();
}

bootstrap();