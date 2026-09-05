import { Controller, Get, Req, Res, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import type { Request, Response } from 'express';
import { Public } from './decorators/public.decorator';
import { AuthService, GoogleUser } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Get('google')
  @UseGuards(AuthGuard('google'))
  googleAuth() {}

  @Public()
  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  async googleAuthRedirect(@Req() req: Request, @Res() res: Response) {
    const result = await this.authService.googleLogin(
      req as Request & { user: GoogleUser },
    );
    return res.redirect(
      `https://app.wafizo.fr/login?accessToken=${result.accessToken}`,
    );
  }

  @Get('me')
  async getMe(@Req() req: Request) {
    const user = req.user as { userId: string };
    return this.authService.findUserById(user.userId);
  }
}
