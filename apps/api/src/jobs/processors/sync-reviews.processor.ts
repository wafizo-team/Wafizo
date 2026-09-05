import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class SyncReviewsProcessor {
  constructor(private prisma: PrismaService) {}
}
