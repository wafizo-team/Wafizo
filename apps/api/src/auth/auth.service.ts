import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService) {}

  async validateGoogleUser(details: {
    email: string;
    firstName: string;
    lastName: string;
    picture?: string;
  }) {
    const existingUser = await this.prisma.user.findUnique({
      where: { email: details.email },
    });

    if (existingUser) {
      return existingUser;
    }

    return this.prisma.user.create({
      data: {
        email: details.email,
        name: `${details.firstName} ${details.lastName}`,
      },
    });
  }
}
