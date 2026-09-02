import { Injectable } from '@nestjs/common';

@Injectable()
export class AuthService {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  googleLogin(req: any) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
    const user = req?.user;
    if (!user) {
      return { message: 'No user from Google' };
    }
    return {
      message: 'User info from Google',
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      user,
    };
  }
}
