import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@prisma/prisma.service';
import { GetReviewsQueryDto } from './dto/get-reviews-query.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import type { Prisma } from '@prisma/client';

@Injectable()
export class ReviewsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(query: GetReviewsQueryDto) {
    const page = Math.max(1, parseInt(query.page || '1', 10));
    const limit = Math.max(1, Math.min(100, parseInt(query.limit || '10', 10)));
    const skip = (page - 1) * limit;

    const where: Prisma.ReviewWhereInput = {};

    if (query.rating) {
      where.rating = parseInt(query.rating, 10);
    }

    if (query.status) {
      where.status = query.status;
    }

    if (query.hasReply !== undefined) {
      const hasReplyBool = query.hasReply === 'true';
      where.reply = hasReplyBool ? { isNot: null } : { is: null };
    }

    if (query.search) {
      where.OR = [
        { authorName: { contains: query.search, mode: 'insensitive' } },
        { content: { contains: query.search, mode: 'insensitive' } },
      ];
    }

    const [data, total] = await Promise.all([
      this.prisma.review.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: query.sort === 'asc' ? 'asc' : 'desc' },
        include: {
          reply: true,
        },
      }),
      this.prisma.review.count({ where }),
    ]);

    return {
      data,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: string) {
    const review = await this.prisma.review.findUnique({
      where: { id },
      include: {
        reply: true,
      },
    });

    if (!review) {
      throw new NotFoundException(`Avis #${id} introuvable`);
    }

    return review;
  }

  async update(id: string, dto: UpdateReviewDto) {
    await this.findOne(id);

    return this.prisma.review.update({
      where: { id },
      data: dto,
      include: {
        reply: true,
      },
    });
  }
}
