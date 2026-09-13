import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class GoogleBusinessStrategy extends PassportStrategy(Strategy, 'google-business') {
  constructor(configService: ConfigService) {
    super({
      clientID: configService.get<string>('GOOGLE_CLIENT_ID'),
      clientSecret: configService.get<string>('GOOGLE_CLIENT_SECRET'),
      callbackURL: configService.get<string>('GOOGLE_BUSINESS_CALLBACK_URL'),
      scope: ['email', 'profile', 'https://www.googleapis.com/auth/business.manage'],
      accessType: 'offline',
      prompt: 'consent',
    } as any);
  }

  async validate(accessToken: string, refreshToken: string, profile: any, done: VerifyCallback): Promise<any> {
    const { id, emails } = profile;
    const user = {
      googleId: id,
      email: emails[0].value,
      accessToken,
      refreshToken,
    };
    done(null, user);
  }
}
