import { Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { BillingService } from './billing.service';

interface RequestWithUser extends Request {
  user: {
    id: string;
    sub?: string;
  };
}

@Controller('billing')
@UseGuards(AuthGuard('jwt'))
export class BillingController {
  constructor(private readonly billingService: BillingService) {}

  @Get('subscription')
  getSubscription(@Req() req: RequestWithUser) {
    const userId = req.user.id || req.user.sub || '';
    return this.billingService.getSubscription();
  }

  @Post('checkout')
  createCheckoutSession(@Req() req: RequestWithUser) {
    const userId = req.user.id || req.user.sub || '';
    return this.billingService.createCheckoutSession();
  }

  @Post('portal')
  createPortalSession(@Req() req: RequestWithUser) {
    const userId = req.user.id || req.user.sub || '';
    return this.billingService.createPortalSession();
  }

  @Post('webhook')
  handleWebhook() {
    return this.billingService.handleWebhook();
  }
}
