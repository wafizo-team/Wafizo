import {
  Controller,
  Get,
  Post,
  Body,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import type { Response } from 'express';
import { ConfigService } from '@nestjs/config';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';
import { Public } from './decorators/public.decorator';
import { encrypt } from '../common/encryption.util';

interface RequestWithUser extends Request {
  user: {
    email: string;
    name: string;
    googleId: string;
    refreshToken?: string;
  };
}

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
  ) {}

  @Public()
  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  async googleAuthRedirect(@Req() req: RequestWithUser, @Res() res: Response) {
    const user = await this.authService.findOrCreateUser(req.user);
    const { accessToken, refreshToken } = this.authService.generateTokens(
      user.id,
      user.email,
    );

    const frontendUrl =
      this.configService.get<string>('FRONTEND_URL') || 'http://localhost:3000';
    return res.redirect(
      `${frontendUrl}/auth/callback?token=${accessToken}&refresh=${refreshToken}`,
    );
  }

  @Public()
  @Post('refresh')
  refreshToken(@Body('refreshToken') refreshToken: string) {
    return this.authService.refreshTokens(refreshToken);
  }

  @Public()
  @Get('google/business')
  @UseGuards(AuthGuard('google-business'))
  async googleBusinessAuth(@Req() req: RequestWithUser) {
    // Redirige vers Google pour le scope business.manage
  }

  @Public()
  @Get('google/business/callback')
  @UseGuards(AuthGuard('google-business'))
  async googleBusinessAuthCallback(@Req() req: RequestWithUser) {
    const user = req.user;
    
    // Chiffrement sécurisé du refresh token Google Business
    const encryptedRefreshToken = user.refreshToken ? encrypt(user.refreshToken) : null;

    // TODO: Enregistrer encryptedRefreshToken en base via ton service
    return {
      message: 'Google Business connected and token encrypted successfully',
      email: user.email,
      hasRefreshToken: !!encryptedRefreshToken,
    };
  }
}
