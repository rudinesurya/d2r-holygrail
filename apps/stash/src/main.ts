import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import cookieParser from 'cookie-parser';
import { Logger } from 'nestjs-pino';
import { StashModule } from './stash.module';
import { MongoExceptionFilter, UnauthorizedExceptionFilter } from '@app/common';
import { Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.create(StashModule);
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
  app.useGlobalFilters(new UnauthorizedExceptionFilter());
  app.useGlobalFilters(new MongoExceptionFilter());
  app.useLogger(app.get(Logger));
  app.use(cookieParser());
  const configService = app.get(ConfigService);
  app.connectMicroservice({
    transport: Transport.RMQ,
    options: {
      urls: [configService.getOrThrow('RABBITMQ_URI')],
      queue: 'stash',
    },
  });
  await app.startAllMicroservices();

  // Enable CORS
  app.enableCors({
    origin: 'http://localhost:8080', // Allow all origins (adjust this for production)
    credentials: true, // Allow cookies to be sent
  });

  await app.listen(configService.get('HTTP_PORT'));
}
bootstrap();
