import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma.service';

interface GoogleUser {
  id?: string;
  email?: string;
  name?: string;
}

interface RequestWithUser {
  user?: GoogleUser;
}

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async googleLogin(req: RequestWithUser) {
    if (!req || !req.user) {
      throw new UnauthorizedException('No user from Google');
    }

    const googleUser = req.user;
    if (!googleUser.email) {
      throw new UnauthorizedException('Email not found from Google');
    }

    let user = await this.prisma.user.findUnique({
      where: { email: googleUser.email },
    });

    if (!user) {
      user = await this.prisma.user.create({
        data: {
          email: googleUser.email,
          name: googleUser.name || '',
          googleId: googleUser.id || null,
        },
      });
    }

    const payload = { email: user.email, sub: user.id };
    return {
      access_token: this.jwtService.sign(payload),
      user,
    };
  }

  async findUserById(id: string) {
    return this.prisma.user.findUnique({
      where: { id },
    });
  }
}
