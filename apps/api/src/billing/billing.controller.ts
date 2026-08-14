import {
  Body,
  Controller,
  Get,
  Headers,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { BillingService } from './billing.service';
import { CreateCheckoutSessionDto } from './dto/billing.dto';

interface AuthenticatedRequest extends Request {
  user: { id: string };
  rawBody?: Buffer;
}

@ApiTags('Billing')
@Controller('billing')
export class BillingController {
  constructor(private readonly billingService: BillingService) {}

  @Get('subscription')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Récupérer l abonnement actuel' })
  getSubscription(@Req() req: AuthenticatedRequest) {
    return this.billingService.getSubscription(req.user.id);
  }

  @Post('checkout')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Créer une session Stripe Checkout' })
  createCheckout(
    @Req() req: AuthenticatedRequest,
    @Body() dto: CreateCheckoutSessionDto,
  ) {
    return this.billingService.createCheckoutSession(req.user.id, dto.priceId);
  }

  @Post('portal')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Créer une session vers le portail Stripe' })
  createPortal(@Req() req: AuthenticatedRequest) {
    return this.billingService.createCustomerPortalSession(req.user.id);
  }

  @Post('webhook')
  @ApiOperation({ summary: 'Réception des webhooks Stripe' })
  handleWebhook(
    @Headers('stripe-signature') signature: string,
    @Req() req: AuthenticatedRequest,
  ) {
    return this.billingService.handleWebhook(
      signature,
      req.rawBody || Buffer.from(''),
    );
  }
}
