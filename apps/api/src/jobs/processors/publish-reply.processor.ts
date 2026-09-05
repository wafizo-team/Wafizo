import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Logger } from '@nestjs/common';
import { Job } from 'bullmq';
import { PrismaService } from "@prisma/prisma.service";

@Processor('reply-publication')
export class PublishReplyProcessor extends WorkerHost {
  private readonly logger = new Logger(PublishReplyProcessor.name);

  constructor(private readonly prisma: PrismaService) {
    super();
  }

  async process(job: Job<{ replyId: string }>): Promise<void> {
    const { replyId } = job.data;
    this.logger.log(`[B11] Traitement du job pour la réponse ID: ${replyId}`);

    // Simulation d'un délai de traitement
    await new Promise((resolve) => setTimeout(resolve, 2000));

    await this.prisma.reply.update({
      where: { id: replyId },
      data: { status: 'PUBLISHED' },
    });

    this.logger.log(
      `[B11] Réponse ${replyId} passée au statut PUBLISHED avec succès.`,
    );
  }
}
