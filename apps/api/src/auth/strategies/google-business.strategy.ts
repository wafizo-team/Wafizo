import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';

@Injectable()
export class GoogleBusinessStrategy extends PassportStrategy(
  Strategy,
  'google-business',
) {
  constructor() {
    super({
      clientID: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
      callbackURL: process.env.GOOGLE_BUSINESS_CALLBACK_URL || '',
      scope: [
        'email',
        'profile',
        'https://www.googleapis.com/auth/business.manage',
      ],
    });
  }

  validate(
    accessToken: string,
    refreshToken: string,
    profile: {
      id?: string;
      emails?: Array<{ value: string }>;
      displayName?: string;
    },
    done: VerifyCallback,
  ): void {
    const googleId = profile.id || '';
    const emails = profile.emails;
    const email = emails && emails[0] ? emails[0].value : '';
    const name = profile.displayName || 'User';

    const googleUser = {
      googleId,
      email,
      name,
      accessToken,
      refreshToken: refreshToken || null,
    };

    done(null, googleUser);
  }
}
