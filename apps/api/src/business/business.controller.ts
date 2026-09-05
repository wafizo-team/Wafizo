import { Controller, Post, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { BusinessService } from './business.service';

interface RequestWithUser {
  user: {
    userId?: string;
    id?: string;
    sub?: string;
  };
}

@Controller('business')
@UseGuards(JwtAuthGuard)
export class BusinessController {
  constructor(private readonly businessService: BusinessService) {}

  @Post('connect')
  async connectBusiness(@Req() req: RequestWithUser): Promise<unknown> {
    const userId = req.user.userId ?? req.user.sub ?? req.user.id ?? '';
    return this.businessService.connectBusiness(userId);
  }
}
