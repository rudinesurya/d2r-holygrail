import { Module } from '@nestjs/common';
import * as Joi from 'joi';
import { StashService } from './stash.service';
import {
  DatabaseModule,
  LoggerModule,
  AUTH_SERVICE,
  HealthModule,
  ITEMS_SERVICE,
  RECORDS_SERVICE,
} from '@app/common';
import { StashRepository } from './stash.repository';
import {
  LedgeDocument,
  LedgeSchema,
} from './models/ledge.schema';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { StashResolver } from './stash.resolver';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriverConfig, ApolloFederationDriver } from '@nestjs/apollo';
import { ScheduleModule } from '@nestjs/schedule';
import { CronJobService } from './cron-job.service';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    DatabaseModule,
    DatabaseModule.forFeature([
      { name: LedgeDocument.name, schema: LedgeSchema },
    ]),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloFederationDriver,
      autoSchemaFile: {
        federation: 2,
      },
    }),
    LoggerModule,
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        MONGODB_URI: Joi.string().required(),
        HTTP_PORT: Joi.number().required(),
        RABBITMQ_URI: Joi.string().required(),
      }),
    }),
    ClientsModule.registerAsync([
      {
        name: AUTH_SERVICE,
        useFactory: (configService: ConfigService) => ({
          transport: Transport.RMQ,
          options: {
            urls: [configService.getOrThrow<string>('RABBITMQ_URI')],
            queue: 'auth',
          },
        }),
        inject: [ConfigService],
      },
    ]),
    ClientsModule.registerAsync([
      {
        name: RECORDS_SERVICE,
        useFactory: (configService: ConfigService) => ({
          transport: Transport.RMQ,
          options: {
            urls: [configService.getOrThrow<string>('RABBITMQ_URI')],
            queue: 'records',
          },
        }),
        inject: [ConfigService],
      },
      {
        name: ITEMS_SERVICE,
        useFactory: (configService: ConfigService) => ({
          transport: Transport.RMQ,
          options: {
            urls: [configService.getOrThrow<string>('RABBITMQ_URI')],
            queue: 'items',
          },
        }),
        inject: [ConfigService],
      },
    ]),
    HealthModule,
  ],
  controllers: [],
  providers: [StashService, StashRepository, StashResolver, CronJobService],
})
export class StashModule { }
