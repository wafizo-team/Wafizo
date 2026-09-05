import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class NotificationsService {
  constructor(private prisma: PrismaService) {}

  getPreferences() {
    return { emailAlerts: true, pushAlerts: false };
  }

  updatePreferences(dto: unknown) {
    return { success: true, dto };
  }
}
