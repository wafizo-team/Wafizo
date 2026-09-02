import { Injectable } from '@nestjs/common';

@Injectable()
export class AuthService {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  googleLogin(req: any) {
    if (!req.user) {
      return { message: 'No user from Google' };
    }
    return {
      message: 'User info from Google',
      user: req.user,
    };
  }
}
