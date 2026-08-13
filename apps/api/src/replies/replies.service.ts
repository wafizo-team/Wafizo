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
    // 1. Récupérer l'utilisateur et son abonnement
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { subscription: true },
    });

    if (!user) {
      throw new NotFoundException(`Utilisateur ${userId} introuvable`);
    }

    const subscription = user.subscription;
    const plan = subscription?.plan || 'FREE';
    const generationsUsed = subscription?.aiGenerationsUsed ?? 0;

    // 2. Vérification du quota pour le plan FREE (max 5)
    if (plan === 'FREE' && generationsUsed >= 5) {
      throw new ForbiddenException({
        statusCode: 403,
        errorCode: 'PLAN_LIMIT_REACHED',
        message:
          'Vous avez atteint la limite de 5 générations mensuelles pour le plan GRATUIT.',
      });
    }

    // 3. Récupérer l'avis
    const review = await this.prisma.review.findUnique({
      where: { id: reviewId },
    });

    if (!review) {
      throw new NotFoundException(`Avis ${reviewId} introuvable`);
    }

    // 4. Générer la suggestion de réponse
    let generatedContent = '';
    if (review.rating >= 4) {
      generatedContent = `Bonjour ${review.authorName || 'client'}, un grand merci pour vos ${review.rating} étoiles ! Nous sommes ravis que votre expérience vous ait plu et espérons vous revoir très bientôt.`;
    } else {
      generatedContent = `Bonjour ${review.authorName || 'client'}, merci pour votre retour. Nous sommes désolés que votre expérience n ait pas été parfaite. N hésitez pas à nous contacter directement pour en discuter.`;
    }

    // 5. Incrémenter aiGenerationsUsed si un abonnement existe
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

    if (review.reply) {
      return this.prisma.reply.update({
        where: { id: review.reply.id },
        data: { content: dto.content, status: 'DRAFT' },
      });
    }

    return this.prisma.reply.create({
      data: {
        reviewId,
        content: dto.content,
        status: 'DRAFT',
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

    return this.prisma.reply.update({
      where: { id: review.reply.id },
      data: { status: 'PUBLISHED' },
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

    await this.prisma.reply.delete({
      where: { id: review.reply.id },
    });

    return { message: 'Réponse supprimée avec succès' };
  }
}
