import { Controller, Get, Query } from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { GetReviewsQueryDto } from './dto/get-reviews-query.dto';

@Controller('reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @Get()
  getReviews(@Query() query: GetReviewsQueryDto) {
    return this.reviewsService.findAll(query);
  }
}
