import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback, Profile } from 'passport-google-oauth20';
import { AuthService } from '../auth.service';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(private readonly authService: AuthService) {
    super({
      clientID: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
      callbackURL:
        process.env.GOOGLE_CALLBACK_URL ||
        'http://localhost:3000/auth/google/callback',
      scope: ['email', 'profile'],
    });
  }

  async validate(
    _accessToken: string,
    _refreshToken: string,
    profile: Profile,
    done: VerifyCallback,
  ): Promise<void> {
    const { name, emails, id, photos } = profile;

    const formattedName = name
      ? `${name.givenName || ''} ${name.familyName || ''}`.trim()
      : 'Utilisateur Google';

    const userProfile = {
      googleId: id,
      email: emails && emails[0] ? emails[0].value : '',
      name: formattedName,
      picture: photos && photos[0] ? photos[0].value : undefined,
    };

    const user = (await this.authService.findOrCreateUser(
      userProfile,
    )) as Express.User;

    done(null, user);
  }
}
