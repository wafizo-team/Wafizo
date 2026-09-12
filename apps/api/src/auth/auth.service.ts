import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';

export interface GoogleUser {
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

    let user = await this.prisma.user.findUnique({ where: { email } });
    
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

  async generateTokens(user: { id: string; email: string }) {
    const payload = { sub: user.id, email: user.email };
    const accessToken = this.jwtService.sign(payload, { expiresIn: '15m' });
    const refreshToken = this.jwtService.sign(payload, { expiresIn: '7d' });

    return {
      accessToken,
      refreshToken,
    };
  }

  async googleLogin(req: { user: GoogleUser }) {
    if (!req.user) {
      throw new UnauthorizedException('Aucun utilisateur Google trouvé');
    }

    const user = await this.findOrCreateUser(req.user);
    return this.generateTokens({ id: user.id, email: user.email });
  }

<<<<<<< HEAD
  async refreshTokens(refreshToken: string) {
    try {
      const payload = this.jwtService.verify(refreshToken);
      const userId = payload.sub || payload.userId;

      const user = await this.prisma.user.findUnique({ where: { id: userId } });
      if (!user) {
        throw new UnauthorizedException('Utilisateur non trouvé');
      }

      return this.generateTokens({ id: user.id, email: user.email });
    } catch (error) {
      throw new UnauthorizedException('Refresh token invalide ou expiré');
    }
=======
  async findUserById(id: string) {
    return this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        name: true,
        createdAt: true,
        businesses: {
          select: {
            id: true,
            name: true,
            slug: true,
            sources: {
              select: {
                id: true,
                type: true,
                externalId: true,
              },
            },
          },
        },
      },
    });
>>>>>>> origin/main
  }
}
