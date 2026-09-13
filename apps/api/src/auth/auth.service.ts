import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService) {}

  generateTokens(userId: string, email: string) {
    const payload = { sub: userId, userId, email };
    return {
      accessToken: this.jwtService.sign(payload),
    };
  }
}
