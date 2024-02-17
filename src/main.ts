import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import * as morgan from 'morgan';
import { CORS } from './constants/cors';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  //TODO: add global prefixer
  app.setGlobalPrefix('/api')
  //TODO: add morgan logger
  app.use(morgan('dev', {}));
  //TODO: Add CORS
  app.enableCors(CORS);
  //TODO: add global pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    })
  );
  //TODO: add global exception filter
  app.useGlobalFilters();
  //TODO: add global error handler
  // app.useG();
  //TODO: add global interceptors
  app.useGlobalInterceptors();
  //TODO: add global guards
  app.useGlobalGuards();
  //TODO: add global pipes  
  await app.listen(configService.get('PORT'));
}
bootstrap();
