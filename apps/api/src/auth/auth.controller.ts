import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import type { Request } from 'express';
import { Public } from './decorators/public.decorator';

@Controller('auth')
export class AuthController {
  @Public()
  @Get('google')
  @UseGuards(AuthGuard('google'))
  async googleAuth(): Promise<void> {
    // Initiates the Google OAuth flow
  }

  @Public()
  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  googleAuthRedirect(@Req() req: Request) {
    const user = (req as Request & { user: unknown }).user;
    return {
      message: 'Connexion Google réussie !',
      user,
    };
  }
}
