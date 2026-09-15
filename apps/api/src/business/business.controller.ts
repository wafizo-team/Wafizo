import { Controller, Get, Post, Body, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { BusinessService } from './business.service';
import { Request } from 'express';

interface AuthenticatedRequest extends Request {
  user: {
    userId: string;
  };
}

@Controller('business')
export class BusinessController {
  constructor(private readonly businessService: BusinessService) {}

  @Get('google-locations')
  @UseGuards(AuthGuard('jwt'))
  async getGoogleLocations(@Req() req: AuthenticatedRequest): Promise<unknown> {
    const userId = req.user.userId;
    return this.businessService.getGoogleLocations(userId);
  }

  @Post('connect')
  @UseGuards(AuthGuard('jwt'))
  async connectBusiness(
    @Req() req: AuthenticatedRequest,
    @Body('googleLocationId') googleLocationId: string,
  ): Promise<unknown> {
    const userId = req.user.userId;
    return this.businessService.connectBusiness(userId, googleLocationId);
  }

  @Get('reviews')
  @UseGuards(AuthGuard('jwt'))
  async getGoogleReviews(@Req() req: AuthenticatedRequest): Promise<unknown> {
    const userId = req.user.userId;
    return this.businessService.getGoogleReviews(userId);
  }
}
