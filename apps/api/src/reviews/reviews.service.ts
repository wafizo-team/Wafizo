import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ReviewsService {
  constructor(private prisma: PrismaService) {}

  async findAll(query: any) {
    return [];
  }

  async findOne(id: string) {
    return { id };
  }

  async update(id: string, dto: any) {
    return { id, ...dto };
  }
}
