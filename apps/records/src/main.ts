import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import cookieParser from 'cookie-parser';
import { Logger } from 'nestjs-pino';
import { RecordsModule } from './records.module';

async function bootstrap() {
  const app = await NestFactory.create(RecordsModule);
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
  app.useLogger(app.get(Logger));
  app.use(cookieParser());
  const configService = app.get(ConfigService);

  // Enable CORS
  app.enableCors({
    origin: 'http://localhost:5173', // Allow all origins (adjust this for production)
    credentials: true, // Allow cookies to be sent
  });
  
  await app.listen(configService.get('HTTP_PORT'));
}
bootstrap();
