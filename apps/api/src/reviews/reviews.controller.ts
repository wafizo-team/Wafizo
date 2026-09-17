import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('reviews')
@UseGuards(JwtAuthGuard)
export class ReviewsController {
  @Get()
  findAll() {
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
