import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class NotificationsService {
  constructor(private prisma: PrismaService) {}

  async getPreferences(userId: string) {
    return { emailAlerts: true, pushAlerts: false };
  }

  async updatePreferences(userId: string, dto: any) {
    return { success: true, dto };
  }
}
