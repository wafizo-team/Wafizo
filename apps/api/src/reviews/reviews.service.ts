import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { GetReviewsQueryDto } from './dto/get-reviews-query.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class ReviewsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(userId: string, query: GetReviewsQueryDto) {
    const page = Math.max(1, query.page ?? 1);
    const limit = Math.max(1, Math.min(100, query.limit ?? 10));
    const skip = (page - 1) * limit;

    const where: Prisma.ReviewWhereInput = {
      business: {
        userId: userId,
      },
    };

    if (query.rating) {
      where.rating = Number(query.rating);
    }

    if (query.status) {
      where.status = query.status;
    }

    if (query.hasReply !== undefined) {
      if (query.hasReply === 'true') {
        where.reply = { isNot: null };
      } else if (query.hasReply === 'false') {
        where.reply = null;
      }
    }

    if (query.search) {
      where.OR = [
        { authorName: { contains: query.search, mode: 'insensitive' } },
        { content: { contains: query.search, mode: 'insensitive' } },
      ];
    }

    const sortOrder = query.sort === 'asc' ? 'asc' : 'desc';

    const [total, items] = await Promise.all([
      this.prisma.review.count({ where }),
      this.prisma.review.findMany({
        where,
        take: limit,
        skip,
        orderBy: { createdAt: sortOrder },
        include: { reply: true },
      }),
    ]);

    const totalPages = Math.ceil(total / limit);

    return {
      data: items,
      meta: {
        total,
        page,
        limit,
        totalPages,
      },
    };
  }

  async findOne(userId: string, id: string) {
    const review = await this.prisma.review.findFirst({
      where: {
        id,
        business: { userId },
      },
      include: { reply: true },
    });

    if (!review) {
      throw new NotFoundException(`Avis ${id} introuvable ou non autorisé`);
    }

    return review;
  }

  async update(userId: string, id: string, dto: UpdateReviewDto) {
    const review = await this.prisma.review.findFirst({
      where: {
        id,
        business: { userId },
      },
    });

    if (!review) {
      throw new NotFoundException(`Avis ${id} introuvable ou non autorisé`);
    }

    return this.prisma.review.update({
      where: { id },
      data: dto,
    });
  }
}
