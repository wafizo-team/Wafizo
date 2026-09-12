import { Controller, Get, Patch, Delete, Body, Request, UseGuards, UnauthorizedException } from '@nestjs/common';
import { UsersService, UpdateUserProfileDto } from './users.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

interface RequestWithUser {
  user: {
    userId: string;
    email: string;
  };
}

@Controller('users')
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  getMe(@Request() req: RequestWithUser) {
    const userId = req.user?.userId;
    if (!userId) {
      throw new UnauthorizedException('Utilisateur non authentifié');
    }
    return this.usersService.findMe(userId);
  }

  @Patch('me')
  updateMe(@Request() req: RequestWithUser, @Body() dto: UpdateUserProfileDto) {
    const userId = req.user?.userId;
    if (!userId) {
      throw new UnauthorizedException('Utilisateur non authentifié');
    }
    return this.usersService.updateMe(userId, dto);
  }

  @Delete('me')
  deleteMe(@Request() req: RequestWithUser) {
    const userId = req.user?.userId;
    if (!userId) {
      throw new UnauthorizedException('Utilisateur non authentifié');
    }
    return this.usersService.deleteMe(userId);
  }
}
