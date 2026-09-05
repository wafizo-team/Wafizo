import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class BusinessService {
  constructor(private readonly prisma: PrismaService) {}

  async connectBusiness(userId: string): Promise<unknown> {
    const prismaClient = this.prisma as unknown as {
      business: {
        findFirst(args: { where: { userId: string } }): Promise<unknown>;
        create(args: {
          data: { name: string; slug: string; userId: string };
        }): Promise<unknown>;
      };
    };

    const existing = await prismaClient.business.findFirst({
      where: { userId },
    });

    if (existing) {
      return existing;
    }

    return prismaClient.business.create({
      data: {
        name: 'Mon Établissement',
        slug: `business-${userId}-${Date.now()}`,
        userId,
      },
    });
  }
}
