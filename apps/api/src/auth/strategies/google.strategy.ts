import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';
import { Injectable } from '@nestjs/common';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor() {
    super({
      clientID: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      callbackURL:
        process.env.GOOGLE_CALLBACK_URL ||
        'https://wafizo-auth.loca.lt/auth/google/callback',
      scope: ['email', 'profile'],
      passReqToCallback: true,
    });
  }

  validate(
    _req: unknown,
    accessToken: string,
    _refreshToken: string,
    profile: {
      name?: { givenName?: string; familyName?: string };
      emails?: Array<{ value: string }>;
      photos?: Array<{ value: string }>;
    },
    done: VerifyCallback,
  ): void {
    const { name, emails, photos } = profile;
    const user = {
      email: emails?.[0]?.value,

      firstName: name?.givenName,

      lastName: name?.familyName,

      picture: photos?.[0]?.value,
      accessToken,
    };
    done(null, user);
  }
}
