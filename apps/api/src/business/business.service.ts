import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';
import { decrypt } from '../common/encryption.util';
import axios, { AxiosResponse } from 'axios';

interface GoogleTokenRecord {
  refreshToken: string;
}

interface TokenResponseData {
  access_token: string;
}

interface AccountItem {
  name: string;
}

interface AccountsResponseData {
  accounts?: AccountItem[];
}

interface LocationsResponseData {
  locations?: unknown[];
}

interface ReviewItem {
  reviewId?: string;
  name?: string;
  comment?: string;
  starRating?: string;
  createTime?: string;
  updateTime?: string;
  reviewer?: {
    displayName?: string;
  };
}

interface ReviewsResponseData {
  reviews?: ReviewItem[];
  nextPageToken?: string;
}

interface BusinessRecord {
  id: string;
  userId: string;
  name: string;
  slug: string;
  googleLocationId?: string | null;
  connectionStatus?: string;
  source?: string;
}

@Injectable()
export class BusinessService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService,
  ) {}

  async getValidAccessToken(userId: string): Promise<string> {
    const prismaClient = this.prisma as unknown as {
      googleToken: {
        findUnique(args: {
          where: { userId: string };
        }): Promise<GoogleTokenRecord | null>;
      };
    };

    const googleToken = await prismaClient.googleToken.findUnique({
      where: { userId },
    });

    if (!googleToken || !googleToken.refreshToken) {
      throw new UnauthorizedException('Google Business account not connected.');
    }

    const refreshToken = decrypt(googleToken.refreshToken);

    const clientId = this.configService.get<string>('GOOGLE_CLIENT_ID');
    const clientSecret = this.configService.get<string>('GOOGLE_CLIENT_SECRET');

    try {
      const tokenResponse = await axios.post<TokenResponseData>(
        'https://oauth2.googleapis.com/token',
        null,
        {
          params: {
            client_id: clientId,
            client_secret: clientSecret,
            refresh_token: refreshToken,
            grant_type: 'refresh_token',
          },
        },
      );

      return tokenResponse.data.access_token;
    } catch {
      throw new UnauthorizedException('Failed to refresh Google access token.');
    }
  }

  async connectBusiness(
    userId: string,
    googleLocationId: string,
  ): Promise<unknown> {
    const prismaClient = this.prisma as unknown as {
      business: {
        findFirst(args: {
          where: { userId: string };
        }): Promise<BusinessRecord | null>;
        create(args: {
          data: Record<string, unknown>;
        }): Promise<BusinessRecord>;
        update(args: {
          where: { id: string };
          data: Record<string, unknown>;
        }): Promise<BusinessRecord>;
      };
    };

    const existing = await prismaClient.business.findFirst({
      where: { userId },
    });

    if (existing) {
      return prismaClient.business.update({
        where: { id: existing.id },
        data: {
          googleLocationId,
          connectionStatus: 'CONNECTED',
          source: 'GOOGLE',
        },
      });
    }

    return prismaClient.business.create({
      data: {
        name: 'Mon Établissement',
        slug: `business-${userId}-${Date.now()}`,
        userId,
        googleLocationId,
        connectionStatus: 'CONNECTED',
        source: 'GOOGLE',
      },
    });
  }

  async getGoogleLocations(userId: string): Promise<unknown> {
    const accessToken = await this.getValidAccessToken(userId);

    const accountsResponse: AxiosResponse<AccountsResponseData> =
      await axios.get(
        'https://mybusinessaccountmanagement.googleapis.com/v1/accounts',
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        },
      );

    const accounts = accountsResponse.data.accounts || [];
    if (accounts.length === 0) {
      return [];
    }

    const firstAccount = accounts[0];
    const accountName = firstAccount?.name;
    if (!accountName) {
      return [];
    }

    const locationsResponse: AxiosResponse<LocationsResponseData> =
      await axios.get(
        `https://mybusinessbusinessinformation.googleapis.com/v1/${accountName}/locations`,
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        },
      );

    return locationsResponse.data.locations || [];
  }

  async getGoogleReviews(userId: string): Promise<unknown> {
    const prismaClient = this.prisma as unknown as {
      business: {
        findFirst(args: {
          where: { userId: string };
        }): Promise<BusinessRecord | null>;
      };
    };

    const business = await prismaClient.business.findFirst({
      where: { userId },
    });

    if (!business || !business.googleLocationId) {
      throw new UnauthorizedException(
        'No connected Google business location found for this user.',
      );
    }

    const accessToken = await this.getValidAccessToken(userId);
    const locationPath = business.googleLocationId;

    try {
      const reviewsResponse: AxiosResponse<ReviewsResponseData> =
        await axios.get(
          `https://mybusiness.googleapis.com/v4/${locationPath}/reviews`,
          {
            headers: { Authorization: `Bearer ${accessToken}` },
          },
        );

      return reviewsResponse.data.reviews || [];
    } catch {
      return [];
    }
  }
}
