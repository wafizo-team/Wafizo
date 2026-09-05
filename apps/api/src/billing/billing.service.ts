import { Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Plan } from '@prisma/client';
import Stripe from 'stripe';
import { PrismaService } from "@prisma/prisma.service";

@Injectable()
export class BillingService {
  private stripe: Stripe;

  constructor(
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService,
  ) {
    const apiKey =
      this.configService.get<string>('STRIPE_SECRET_KEY') || 'sk_test_dummy';
    this.stripe = new Stripe(apiKey);
  }

  async getSubscription(userId: string) {
    const subscription = await this.prisma.subscription.findUnique({
      where: { userId },
    });

    if (!subscription) {
      return { plan: Plan.FREE, aiGenerationsUsed: 0 };
    }

    return subscription;
  }

  async createCheckoutSession(userId: string, priceId: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new NotFoundException('Utilisateur introuvable');

    const appUrl = this.configService.get<string>(
      'APP_URL',
      'http://localhost:3000',
    );

    const session = await this.stripe.checkout.sessions.create({
      mode: 'subscription',
      payment_method_types: ['card'],
      customer_email: user.email,
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${appUrl}/dashboard/billing?success=true`,
      cancel_url: `${appUrl}/dashboard/billing?canceled=true`,
      metadata: { userId },
    });

    return { url: session.url };
  }

  async createCustomerPortalSession(userId: string) {
    const subscription = await this.prisma.subscription.findUnique({
      where: { userId },
    });

    if (!subscription || !subscription.stripeCustomerId) {
      throw new NotFoundException(
        'Aucun identifiant Stripe client trouvé pour cet utilisateur',
      );
    }

    const appUrl = this.configService.get<string>(
      'APP_URL',
      'http://localhost:3000',
    );

    const portalSession = await this.stripe.billingPortal.sessions.create({
      customer: subscription.stripeCustomerId,
      return_url: `${appUrl}/dashboard/billing`,
    });

    return { url: portalSession.url };
  }

  async handleWebhook(signature: string, rawBody: Buffer) {
    const webhookSecret = this.configService.get<string>(
      'STRIPE_WEBHOOK_SECRET',
      '',
    );
    let event: Stripe.Event;

    try {
      event = this.stripe.webhooks.constructEvent(
        rawBody,
        signature,
        webhookSecret,
      );
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      throw new Error(`Erreur Webhook Stripe: ${errorMessage}`);
    }

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object;
      const userId = session.metadata?.userId;
      const customerId = session.customer as string;
      const subscriptionId = session.subscription as string;

      if (userId) {
        await this.prisma.subscription.upsert({
          where: { userId },
          update: {
            stripeCustomerId: customerId,
            stripeSubscriptionId: subscriptionId,
            plan: Plan.PRO,
          },
          create: {
            userId,
            stripeCustomerId: customerId,
            stripeSubscriptionId: subscriptionId,
            plan: Plan.PRO,
          },
        });
      }
    }

    if (event.type === 'customer.subscription.deleted') {
      const stripeSubscription = event.data.object;
      const customerId = stripeSubscription.customer as string;

      const subscription = await this.prisma.subscription.findFirst({
        where: { stripeCustomerId: customerId },
      });

      if (subscription) {
        await this.prisma.subscription.update({
          where: { id: subscription.id },
          data: {
            plan: Plan.FREE,
            aiGenerationsUsed: 0,
            stripeSubscriptionId: null,
          },
        });
      }
    }

    return { received: true };
  }
}
