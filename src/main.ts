import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';

import { AppModule } from './app.module';

import { GlobalExceptionFilter } from './util/exception/global-exception-filter';
import helmet from 'helmet';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, 
    {
      cors: true,
      abortOnError: true
    }
  );
  
  app.use(helmet());
  app.useGlobalFilters(new GlobalExceptionFilter());
  app.enableCors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    optionsSuccessStatus: 200,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
      disableErrorMessages: false,
    }),
  );
  
  await app.listen(3000);
}

'use strict';
bootstrap();