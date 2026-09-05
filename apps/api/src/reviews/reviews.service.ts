import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ReviewsService {
  constructor(private prisma: PrismaService) {}

  findAll(_query: Record<string, unknown>) {
    return [];
  }

  findOne(id: string) {
    return { id };
  }

  update(id: string, dto: Record<string, unknown>) {
    return { id, ...dto };
  }
}
