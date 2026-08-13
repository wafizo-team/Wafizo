import { Injectable, NotFoundException } from '@nestjs/common';
import { ReplyStatus } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateOrUpdateReplyDto } from './dto/create-or-update-reply.dto';
import { GenerateReplyDto } from './dto/generate-reply.dto';

@Injectable()
export class RepliesService {
  constructor(private readonly prisma: PrismaService) {}

  async generate(reviewId: string, dto: GenerateReplyDto) {
    const review = await this.prisma.review.findUnique({
      where: { id: reviewId },
    });

    if (!review) {
      throw new NotFoundException(`Avis #${reviewId} introuvable`);
    }

    const tone = dto.tone || 'professionnel et chaleureux';
    const generatedContent = `Bonjour ${review.authorName}, merci d'avoir pris le temps de nous laisser un avis ! Nous sommes ravis que votre expérience vous ait plu. À très bientôt dans notre établissement ! (Ton: ${tone})`;

    return {
      reviewId,
      generatedContent,
      tone,
    };
  }

  async upsert(reviewId: string, dto: CreateOrUpdateReplyDto) {
    const review = await this.prisma.review.findUnique({
      where: { id: reviewId },
      include: { reply: true },
    });

    if (!review) {
      throw new NotFoundException(`Avis #${reviewId} introuvable`);
    }

    if (review.reply) {
      return this.prisma.reply.update({
        where: { id: review.reply.id },
        data: {
          content: dto.content,
          status: ReplyStatus.DRAFT,
        },
      });
    }

    return this.prisma.reply.create({
      data: {
        content: dto.content,
        status: ReplyStatus.DRAFT,
        review: { connect: { id: reviewId } },
      },
    });
  }

  async publish(reviewId: string) {
    const review = await this.prisma.review.findUnique({
      where: { id: reviewId },
      include: { reply: true },
    });

    if (!review || !review.reply) {
      throw new NotFoundException(
        `Aucune réponse enregistrée à publier pour l'avis #${reviewId}`,
      );
    }

    return this.prisma.reply.update({
      where: { id: review.reply.id },
      data: {
        status: ReplyStatus.PUBLISHED,
      },
    });
  }

  async remove(reviewId: string) {
    const review = await this.prisma.review.findUnique({
      where: { id: reviewId },
      include: { reply: true },
    });

    if (!review || !review.reply) {
      throw new NotFoundException(
        `Aucune réponse à supprimer pour l'avis #${reviewId}`,
      );
    }

    await this.prisma.reply.delete({
      where: { id: review.reply.id },
    });

    return {
      message: `Réponse liée à l'avis #${reviewId} supprimée avec succès`,
    };
  }
}
