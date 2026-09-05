import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class BillingService {
  constructor(private prisma: PrismaService) {}

  getSubscription(_userId: string) {
    return { status: 'active', plan: 'pro' };
  }

  createCheckoutSession(_userId: string, _priceId: string) {
    return { url: 'https://checkout.stripe.com/test' };
  }

  createCustomerPortalSession(_userId: string) {
    return { url: 'https://billing.stripe.com/test' };
  }

  handleWebhook(_signature: string, _payload: unknown) {
    return { received: true };
  }
}
