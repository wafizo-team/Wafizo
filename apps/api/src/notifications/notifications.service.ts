import { Injectable } from '@nestjs/common';
import { PrismaService } from "@prisma/prisma.service";
import { UpdateNotificationPreferencesDto } from './dto/update-notification-preferences.dto';

@Injectable()
export class NotificationsService {
  constructor(private readonly prisma: PrismaService) {}

  async getPreferences(userId: string) {
    const preferences = await this.prisma.notificationPreferences.findUnique({
      where: { userId },
    });

    if (!preferences) {
      return this.prisma.notificationPreferences.create({
        data: {
          userId,
          emailEnabled: true,
          smsEnabled: false,
        },
      });
    }

    return preferences;
  }

  async updatePreferences(
    userId: string,
    dto: UpdateNotificationPreferencesDto,
  ) {
    return this.prisma.notificationPreferences.upsert({
      where: { userId },
      update: {
        ...(dto.emailEnabled !== undefined && {
          emailEnabled: dto.emailEnabled,
        }),
        ...(dto.smsEnabled !== undefined && { smsEnabled: dto.smsEnabled }),
        ...(dto.phoneNumber !== undefined && { phoneNumber: dto.phoneNumber }),
      },
      create: {
        userId,
        emailEnabled: dto.emailEnabled ?? true,
        smsEnabled: dto.smsEnabled ?? false,
        phoneNumber: dto.phoneNumber,
      },
    });
  }
}
