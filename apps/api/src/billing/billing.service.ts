import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class BillingService {
  constructor(private prisma: PrismaService) {}

  getSubscription() {
    return { status: 'active' };
  }

  createCheckoutSession() {
    return { url: 'https://checkout.stripe.com/mock' };
  }

  createPortalSession() {
    return { url: 'https://billing.stripe.com/mock' };
  }

  handleWebhook() {
    return { received: true };
  }
}
