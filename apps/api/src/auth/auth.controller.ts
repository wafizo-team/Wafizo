import { Controller, Get, Req, Res, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';
import type { Request, Response } from 'express';
import { AuthService, GoogleUser } from './auth.service';
import { Public } from './decorators/public.decorator';

interface RequestWithUser extends Request {
  user: GoogleUser & { id?: string; googleId?: string };
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
    const { accessToken, refreshToken } = this.authService.generateTokens(
      user.id,
      user.email,
    );
    const frontendUrl = this.configService.get<string>(
      'FRONTEND_URL',
      'http://localhost:5173',
    );
    const redirectUrl = new URL('/auth/callback', frontendUrl);
    redirectUrl.searchParams.set('accessToken', accessToken);
    redirectUrl.searchParams.set('refreshToken', refreshToken);
    return res.redirect(redirectUrl.toString());
  }

  @Get('me')
  async getMe(@Req() req: Request) {
    const user = req.user as { userId: string };
    return this.authService.findUserById(user.userId);
  }
}
