import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

export interface GoogleUserRequest {
  user?: {
    id?: string;
    email?: string;
    [key: string]: unknown;
  };
}

@Injectable()
export class AuthService {
  constructor(private readonly jwtService: JwtService) {}

  googleLogin(req: GoogleUserRequest) {
    if (!req.user) {
      return { message: 'Aucun utilisateur Google trouvé' };
    }
    const payload = { email: req.user.email, sub: req.user.id };
    return {
      message: 'Connexion Google réussie',
      user: req.user,
      accessToken: this.jwtService.sign(payload),
    };
  }
}
