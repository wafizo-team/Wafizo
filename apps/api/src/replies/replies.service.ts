import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class RepliesService {
  constructor(private prisma: PrismaService) {}

  generateReply(userId: string, reviewId: string) {
    void userId;
    void reviewId;
    return { reply: 'Generated reply text' };
  }

  upsertReply(reviewId: string, dto: unknown) {
    return { reviewId, dto };
  }

  publishReply(reviewId: string) {
    return { success: true, reviewId };
  }

  deleteReply(reviewId: string) {
    return { deleted: true, reviewId };
  }
}
