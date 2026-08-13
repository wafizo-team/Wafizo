import { Controller, Get, Req } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { AuthService } from './auth.service';
import type { GoogleUserRequest } from './auth.service';
import { Public } from './decorators/public.decorator';

interface RequestWithUser {
  user?: unknown;
}

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Get('google')
  @ApiOperation({ summary: 'Initiation de la connexion via Google OAuth2' })
  googleAuth() {}

  @Public()
  @Get('google/callback')
  @ApiOperation({ summary: 'Callback après authentification Google' })
  googleAuthRedirect(@Req() req: GoogleUserRequest) {
    return this.authService.googleLogin(req);
  }

  @ApiBearerAuth()
  @Get('me')
  @ApiOperation({ summary: "Récupérer le profil de l'utilisateur connecté" })
  @ApiResponse({ status: 200, description: 'Profil utilisateur récupéré.' })
  @ApiResponse({ status: 401, description: 'Non autorisé.' })
  getProfile(@Req() req: RequestWithUser): unknown {
    return req.user;
  }
}
