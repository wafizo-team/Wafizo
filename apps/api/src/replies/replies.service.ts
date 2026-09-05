import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class RepliesService {
  constructor(private prisma: PrismaService) {}

  async generateReply(userId: string, reviewId: string) {
    return { reply: 'Generated reply text' };
  }

  async upsertReply(reviewId: string, dto: any) {
    return { reviewId, ...dto };
  }

  async publishReply(reviewId: string) {
    return { success: true, reviewId };
  }

  async deleteReply(reviewId: string) {
    return { deleted: true, reviewId };
  }
}
