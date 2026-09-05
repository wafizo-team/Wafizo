import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class NotificationsService {
  constructor(private prisma: PrismaService) {}

  getPreferences(_userId: string) {
    return { emailAlerts: true, pushAlerts: false };
  }

  updatePreferences(_userId: string, dto: unknown) {
    return { success: true, dto };
  }
}
