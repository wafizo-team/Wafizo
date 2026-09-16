import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';
import { decrypt } from '../common/encryption.util';
import axios, { AxiosResponse } from 'axios';

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

@Injectable()
export class BusinessService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService,
  ) {}

  async getValidAccessToken(userId: string): Promise<string> {
    const googleToken = await this.prisma.googleTokens.findUnique({
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
    const existing = await this.prisma.business.findFirst({
      where: { userId },
    });

    if (existing) {
      return this.prisma.business.update({
        where: { id: existing.id },
        data: {
          googleLocationId,
          connectionStatus: 'CONNECTED',
        },
      });
    }

    return this.prisma.business.create({
      data: {
        name: 'Mon Établissement',
        slug: `business-${userId}-${Date.now()}`,
        userId,
        googleLocationId,
        connectionStatus: 'CONNECTED',
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
    const accessToken = await this.getValidAccessToken(userId);

    const business = await this.prisma.business.findFirst({
      where: { userId },
    });

    if (!business || !business.googleLocationId) {
      throw new UnauthorizedException(
        'No connected Google business location found for this user.',
      );
    }

    const locationPath = business.googleLocationId;

    try {
      const reviewsResponse: AxiosResponse<ReviewsResponseData> =
        await axios.get(
          `https://mybusiness.googleapis.com/v4/${locationPath}/reviews`,
          {
            headers: { Authorization: `Bearer ${accessToken}` },
          },
        );

      const reviews = reviewsResponse.data.reviews || [];
      return {
        data: reviews,
        meta: {
          totalItems: reviews.length,
          page: 1,
          limit: 10,
          totalPages: Math.ceil(reviews.length / 10) || 0,
        },
      };
    } catch {
      return {
        data: [],
        meta: {
          totalItems: 0,
          page: 1,
          limit: 10,
          totalPages: 0,
        },
      };
    }
  }
}
