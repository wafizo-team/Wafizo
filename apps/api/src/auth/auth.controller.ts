import { Controller, Get, Post, Body, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { Public } from './decorators/public.decorator';

interface RequestWithUser {
  user: {
    id: string;
    email: string;
  };
}

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
  async googleAuthRedirect(@Req() req: RequestWithUser) {
    return this.authService.generateTokens(req.user);
  }

  @Get('me')
  getProfile(@Req() req: RequestWithUser) {
    return req.user;
  }

  @Public()
  @Post('refresh')
  async refresh(@Body('refreshToken') refreshToken: string) {
    return this.authService.refreshTokens(refreshToken);
  }
}
