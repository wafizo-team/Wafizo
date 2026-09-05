import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from "@prisma/prisma.service";

export class UpdateUserProfileDto {
  name?: string;
}

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async findMe(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        name: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      throw new NotFoundException('Utilisateur introuvable');
    }

    return user;
  }

  async updateMe(userId: string, dto: UpdateUserProfileDto) {
    return this.prisma.user.update({
      where: { id: userId },
      data: dto,
      select: {
        id: true,
        email: true,
        name: true,
        updatedAt: true,
      },
    });
  }

  async deleteMe(userId: string) {
    await this.prisma.user.delete({
      where: { id: userId },
    });

    return { message: 'Compte supprimé avec succès' };
  }
}
