import { BullModule } from '@nestjs/bullmq';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PrismaModule } from '../prisma/prisma.module';
import { PublishReplyProcessor } from './processors/publish-reply.processor';
import { SyncReviewsProcessor } from './processors/sync-reviews.processor';

@Module({
  imports: [
    PrismaModule,
    BullModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        connection: {
          host: configService.get<string>('REDIS_HOST', 'localhost'),
          port: configService.get<number>('REDIS_PORT', 6379),
        },
      }),
      inject: [ConfigService],
    }),
    BullModule.registerQueue(
      { name: 'reply-publication' },
      { name: 'review-sync' },
    ),
  ],
  providers: [PublishReplyProcessor, SyncReviewsProcessor],
  exports: [BullModule],
})
export class JobsModule {}
