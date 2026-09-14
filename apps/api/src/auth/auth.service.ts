import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';

export interface GoogleUser {
  email: string;
  name: string;
  googleId: string;
}

interface JwtPayload {
  userId: string;
  email: string;
  sub: string;
}

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private prisma: PrismaService,
  ) {}

  async findOrCreateUser(googleUser: GoogleUser) {
    let user = await this.prisma.user.findUnique({
      where: { email: googleUser.email },
    });

    if (!user) {
      user = await this.prisma.user.create({
        data: {
          email: googleUser.email,
          name: googleUser.name,
        },
      });
    }

    return user;
  }

  async generateTokens(user: { id: string; email: string }) {
    const payload = { sub: user.id, userId: user.id, email: user.email };
    const accessToken = await this.jwtService.signAsync(payload, { expiresIn: '15m' });
    const refreshToken = await this.jwtService.signAsync(payload, { expiresIn: '7d' });
    return { accessToken, refreshToken };
  }

  async refreshTokens(refreshToken: string) {
    try {
      const payload = this.jwtService.verify<JwtPayload>(refreshToken);
      return this.generateTokens({ id: payload.userId, email: payload.email });
    } catch {
      throw new Error('Invalid refresh token');
    }
  }

  async saveGoogleBusinessToken(userId: string, encryptedToken: string) {
    return this.prisma.googleTokens.upsert({
      where: { userId },
      create: { userId, refreshToken: encryptedToken },
      update: { refreshToken: encryptedToken },
    });
  }
}
