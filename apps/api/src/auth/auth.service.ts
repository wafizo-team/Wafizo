import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';

interface GoogleUser {
  email: string;
  firstName?: string;
  familyName?: string;
  lastName?: string;
  picture?: string;
}

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async findOrCreateUser(googleUser: GoogleUser) {
    const email = googleUser.email;
    const firstName = googleUser.firstName || '';
    const lastName = googleUser.familyName || googleUser.lastName || '';
    const name = `${firstName} ${lastName}`.trim() || 'Google User';

    let user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      user = await this.prisma.user.create({
        data: {
          email,
          name,
        },
      });
    }

    return user;
  }

  generateTokens(userId: string, email: string) {
    const payload = { sub: userId, email };
    const accessToken = this.jwtService.sign(payload, { expiresIn: '15m' });
    const refreshToken = this.jwtService.sign(payload, { expiresIn: '7d' });

    return { accessToken, refreshToken };
  }

  async refreshTokens(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new Error('User not found');
    }

    return this.generateTokens(user.id, user.email);
  }

  async googleLogin(req: any) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    const googleUser = req?.user as GoogleUser;
    if (!googleUser || !googleUser.email) {
      return { message: 'No user from Google' };
    }

    const user = await this.findOrCreateUser(googleUser);
    const { accessToken, refreshToken } = this.generateTokens(
      user.id,
      user.email,
    );

    return {
      message: 'User successfully authenticated via Google',
      accessToken,
      refreshToken,
      user,
    };
  }
}
