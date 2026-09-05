import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

export class UpdateUserProfileDto {
  name?: string;
}

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  findMe(userId: string) {
    return { id: userId };
  }

  updateMe(userId: string, dto: UpdateUserProfileDto) {
    return { id: userId, ...dto };
  }

  deleteMe(userId: string) {
    return { deleted: true, userId };
  }
}
