import { ReplyStatus, ReplyOrigin } from '@wafizo/shared';
import type { Reply } from '@wafizo/shared';

// Simule B10 : POST .../reply/generate
export async function generateReply(reviewId: string): Promise<string> {
  await new Promise((resolve) => setTimeout(resolve, 1200));

  const templates = [
    'Merci beaucoup pour votre retour, ça nous fait vraiment plaisir !',
    "Nous sommes désolés que votre expérience n'ait pas été à la hauteur. N'hésitez pas à nous contacter directement pour qu'on puisse arranger ça.",
    'Merci pour ce message, à très bientôt chez nous !',
  ];

  return templates[Math.floor(Math.random() * templates.length)];
}

// Simule B10/B11 : PUT .../reply puis POST .../reply/publish
export async function publishReply(reviewId: string, content: string): Promise<Reply> {
  await new Promise((resolve) => setTimeout(resolve, 1500));

  // Simule un échec occasionnel (10%) pour tester l'état FAILED
  if (Math.random() < 0.1) {
    throw new Error('PUBLISH_FAILED');
  }

  return {
    id: `reply-${reviewId}`,
    reviewId,
    content,
    status: ReplyStatus.PUBLISHED,
    origin: ReplyOrigin.AI,
    publishedAt: new Date().toISOString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}
