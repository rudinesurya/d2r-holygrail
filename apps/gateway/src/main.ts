import { NestFactory } from '@nestjs/core';
import { GatewayModule } from './gateway.module';
import { Logger } from 'nestjs-pino';
import { ConfigService } from '@nestjs/config';
import { setApp } from './app';

async function bootstrap() {
  const app = await NestFactory.create(GatewayModule);
  app.useLogger(app.get(Logger));
  const configService = app.get(ConfigService);

  // Enable CORS
  app.enableCors({
    origin: 'http://localhost:5173', // Allow all origins (adjust this for production)
    credentials: true, // Allow cookies to be sent
  });
  
  await app.listen(configService.getOrThrow('HTTP_PORT'));
  setApp(app);
}
bootstrap();