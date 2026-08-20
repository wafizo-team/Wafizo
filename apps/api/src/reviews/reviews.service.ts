import {
  Controller,
  Get,
  Patch,
  Param,
  Query,
  Body,
  Req,
} from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { GetReviewsQueryDto } from './dto/get-reviews-query.dto';
import { UpdateReviewDto } from './dto/update-review.dto';

@Controller('reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @Get()
  findAll(@Req() req: any, @Query() query: GetReviewsQueryDto) {
    return this.reviewsService.findAll(req.user.id, query);
  }

  @Get(':id')
  findOne(@Req() req: any, @Param('id') id: string) {
    return this.reviewsService.findOne(req.user.id, id);
  }

  @Patch(':id')
  update(
    @Req() req: any,
    @Param('id') id: string,
    @Body() dto: UpdateReviewDto,
  ) {
    return this.reviewsService.update(req.user.id, id, dto);
  }
}
