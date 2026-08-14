import { ReplyStatus } from '@prisma/client';
import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateReplyDto } from './dto/reply.dto';

@Injectable()
export class RepliesService {
  constructor(private readonly prisma: PrismaService) {}

  async generateReply(userId: string, reviewId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { subscription: true },
    });

    if (!user) {
      throw new NotFoundException(`Utilisateur ${userId} introuvable`);
    }

    const subscription = user.subscription;
    const plan = subscription?.plan ?? 'FREE';
    const generationsUsed = subscription?.aiGenerationsUsed ?? 0;

    if (plan === 'FREE' && generationsUsed >= 5) {
      throw new ForbiddenException({
        statusCode: 403,
        errorCode: 'PLAN_LIMIT_REACHED',
        message:
          'Vous avez atteint la limite de 5 générations mensuelles pour le plan GRATUIT.',
      });
    }

    const review = await this.prisma.review.findUnique({
      where: { id: reviewId },
    });

    if (!review) {
      throw new NotFoundException(`Avis ${reviewId} introuvable`);
    }

    let generatedContent = '';
    if (review.rating >= 4) {
      generatedContent = `Bonjour ${review.authorName ?? 'client'}, un grand merci pour vos ${String(review.rating)} étoiles ! Nous sommes ravis que votre expérience vous ait plu et espérons vous revoir très bientôt.`;
    } else {
      generatedContent = `Bonjour ${review.authorName ?? 'client'}, merci pour votre retour. Nous sommes désolés que votre expérience n'ait pas été parfaite. N'hésitez pas à nous contacter directement pour en discuter.`;
    }

    if (subscription) {
      await this.prisma.subscription.update({
        where: { id: subscription.id },
        data: { aiGenerationsUsed: { increment: 1 } },
      });
    }

    return {
      reviewId,
      generatedContent,
      suggestedTone: review.rating >= 4 ? 'ENTHUSIASTIC' : 'EMPATHETIC',
    };
  }

  async upsertReply(reviewId: string, dto: UpdateReplyDto) {
    const review = await this.prisma.review.findUnique({
      where: { id: reviewId },
      include: { reply: true },
    });

    if (!review) {
      throw new NotFoundException(`Avis ${reviewId} introuvable`);
    }

    const existingReply = review.reply;

    if (existingReply) {
      return this.prisma.reply.update({
        where: { id: existingReply.id },
        data: { content: dto.content, status: ReplyStatus.DRAFT },
      });
    }

    return this.prisma.reply.create({
      data: {
        reviewId,
        content: dto.content,
        status: ReplyStatus.DRAFT,
      },
    });
  }

  async publishReply(reviewId: string) {
    const review = await this.prisma.review.findUnique({
      where: { id: reviewId },
      include: { reply: true },
    });

    if (!review || !review.reply) {
      throw new NotFoundException(
        `Aucune réponse enregistrée pour l'avis ${reviewId}`,
      );
    }

    const existingReply = review.reply;

    return this.prisma.reply.update({
      where: { id: existingReply.id },
      data: { status: ReplyStatus.PUBLISHED },
    });
  }

  async deleteReply(reviewId: string) {
    const review = await this.prisma.review.findUnique({
      where: { id: reviewId },
      include: { reply: true },
    });

    if (!review || !review.reply) {
      throw new NotFoundException(
        `Aucune réponse à supprimer pour l'avis ${reviewId}`,
      );
    }

    const existingReply = review.reply;

    await this.prisma.reply.delete({
      where: { id: existingReply.id },
    });

    return { message: 'Réponse supprimée avec succès' };
  }
}
