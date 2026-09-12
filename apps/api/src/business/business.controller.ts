<<<<<<< HEAD
import { Controller, Post, Req, UseGuards, UnauthorizedException } from '@nestjs/common';
=======
import { Controller, Post, Req, UseGuards } from '@nestjs/common';
>>>>>>> origin/main
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { BusinessService } from './business.service';

interface RequestWithUser {
  user: {
    userId?: string;
    id?: string;
    sub?: string;
<<<<<<< HEAD

=======
>>>>>>> origin/main
  };
}

@Controller('business')
@UseGuards(JwtAuthGuard)
export class BusinessController {
  constructor(private readonly businessService: BusinessService) {}

  @Post('connect')
<<<<<<< HEAD
  async connectBusiness(@Req() req: RequestWithUser): Promise<unknown>
    const userId = req.user.userId ?? req.user.sub ?? req.user.id ?? '';
    const userId = req.user?.userId;
    if (!userId) {
      throw new UnauthorizedException('Utilisateur non authentifié');
    }
=======
  async connectBusiness(@Req() req: RequestWithUser): Promise<unknown> {
    const userId = req.user.userId ?? req.user.sub ?? req.user.id ?? '';
>>>>>>> origin/main
    return this.businessService.connectBusiness(userId);
  }
}
