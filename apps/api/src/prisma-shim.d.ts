declare module "../prisma/prisma.service.js" {
  import { Injectable } from "@nestjs/common";
  @Injectable()
  export class PrismaService {
    user: any;
  }
}
