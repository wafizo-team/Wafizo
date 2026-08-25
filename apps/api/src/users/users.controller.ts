import { Controller, Get, Patch, Delete, Body, Request } from '@nestjs/common';
import { UsersService, UpdateUserProfileDto } from './users.service';

interface RequestWithUser {
  user: {
    id: string;
    email: string;
  };
}

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  getMe(@Request() req: RequestWithUser) {
    return this.usersService.findMe(req.user.id);
  }

  @Patch('me')
  updateMe(@Request() req: RequestWithUser, @Body() dto: UpdateUserProfileDto) {
    return this.usersService.updateMe(req.user.id, dto);
  }

  @Delete('me')
  deleteMe(@Request() req: RequestWithUser) {
    return this.usersService.deleteMe(req.user.id);
  }
}
