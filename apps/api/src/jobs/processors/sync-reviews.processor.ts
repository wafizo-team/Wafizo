import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Logger } from '@nestjs/common';
import { ReviewStatus } from '@prisma/client';
import { Job } from 'bullmq';
import { PrismaService } from '../../prisma/prisma.service';

@Processor('review-sync')
export class SyncReviewsProcessor extends WorkerHost {
  private readonly logger = new Logger(SyncReviewsProcessor.name);

  constructor(private readonly prisma: PrismaService) {
    super();
  }

  async process(job: Job<{ businessId: string }>): Promise<void> {
    const { businessId } = job.data;
    this.logger.log(
      `[B12] Lancement de la synchro des avis pour le commerce ${businessId}`,
    );

    const mockNames = ['Thomas L.', 'Sarah M.', 'Karim B.', 'Claire D.'];
    const mockComments = [
      'Super accueil et prestation de qualité !',
      'Un peu déçu par le temps d attente...',
      'Excellente expérience, je recommande à 100% !',
    ];

    const randomName = mockNames[Math.floor(Math.random() * mockNames.length)];
    const randomComment =
      mockComments[Math.floor(Math.random() * mockComments.length)];
    const randomRating = Math.floor(Math.random() * 5) + 1;

    const newReview = await this.prisma.review.create({
      data: {
        businessId,
        authorName: randomName,
        content: randomComment,
        rating: randomRating,
        status: ReviewStatus.PUBLISHED,
      },
    });

    this.logger.log(
      `[B12] Nouvel avis synchronisé (ID: ${newReview.id}) pour ${businessId}`,
    );
  }
}
