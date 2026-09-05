import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ReviewsService {
  constructor(private prisma: PrismaService) {}

  findAll(_query: unknown) {
    return [];
  }

  findOne(id: string) {
    return { id };
  }

  update(id: string, dto: unknown) {
    return { id, dto };
  }
}
