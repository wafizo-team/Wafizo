import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { type Response, Request } from 'express';
import { ConfigService } from '@nestjs/config';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';
import { Public } from './decorators/public.decorator';
import { encrypt } from '../common/encryption.util';

interface RequestWithUser extends Request {
  user: {
    id: string;
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
  @Get('google')
  @UseGuards(AuthGuard('google'))
  googleAuth() {}

  @Public()
  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  async googleAuthRedirect(@Req() req: RequestWithUser, @Res() res: Response) {
    const user = await this.authService.findOrCreateUser(req.user);
    const { accessToken, refreshToken } = await this.authService.generateTokens(
      {
        id: user.id,
        email: user.email,
      },
    );

    const frontendUrl =
      this.configService.get<string>('FRONTEND_URL') || 'http://localhost:3000';
    return res.redirect(
      `${frontendUrl}/auth/callback?accessToken=${accessToken}&refreshToken=${refreshToken}`,
    );
  }

  @Public()
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  async refreshTokens(@Body('refreshToken') refreshToken: string) {
    return this.authService.refreshTokens(refreshToken);
  }

  @Public()
  @Get('google/business')
  @UseGuards(AuthGuard('google-business'))
  googleBusinessAuth(@Req() _req: RequestWithUser) {
    // Redirige vers Google pour le scope business.manage
  }

  @Public()
  @Get('google/business/callback')
  @UseGuards(AuthGuard('google-business'))
  async googleBusinessAuthCallback(@Req() req: RequestWithUser) {
    const googleUser = req.user;

    // Récupérer ou créer l'utilisateur dans la base Wafizo pour obtenir son VRAI id interne
    const dbUser = await this.authService.findOrCreateUser({
      email: googleUser.email,
      name: googleUser.name,
      googleId: googleUser.googleId,
    });

    const encryptedRefreshToken = googleUser.refreshToken
      ? encrypt(googleUser.refreshToken)
      : null;

    if (encryptedRefreshToken) {
      await this.authService.saveGoogleBusinessToken(
        dbUser.id, // <-- Utilise l'ID interne Wafizo et non l'ID Google externe
        encryptedRefreshToken,
      );
    }

    return {
      message: 'Google Business connected and token encrypted successfully',
      email: dbUser.email,
      hasRefreshToken: !!encryptedRefreshToken,
    };
  }

  @Get('me')
  async getMe(@Req() req: RequestWithUser & { user: { userId: string } }) {
    return this.authService.findUserById(req.user.userId);
  }
}
