import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class NotificationsService {
  constructor(private prisma: PrismaService) {}

  getPreferences(userId: string) {
    void userId;
    return { emailAlerts: true, pushAlerts: false };
  }

  updatePreferences(userId: string, dto: unknown) {
    void userId;
    return { success: true, dto };
  }
}
