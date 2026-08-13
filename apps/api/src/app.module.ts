import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { HealthModule } from './health/health.module';
import { RepliesModule } from './replies/replies.module';

@Module({
  imports: [PrismaModule, AuthModule, HealthModule, RepliesModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
