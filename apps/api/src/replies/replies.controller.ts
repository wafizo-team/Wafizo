import { Controller, Post, Put, Delete, Param, Body } from '@nestjs/common';
import { RepliesService } from './replies.service';
import { CreateOrUpdateReplyDto } from './dto/create-or-update-reply.dto';
import { GenerateReplyDto } from './dto/generate-reply.dto';

@Controller('reviews/:id/reply')
export class RepliesController {
  constructor(private readonly repliesService: RepliesService) {}

  @Post('generate')
  generate(@Param('id') id: string, @Body() dto: GenerateReplyDto) {
    return this.repliesService.generate(id, dto);
  }

  @Put()
  upsert(@Param('id') id: string, @Body() dto: CreateOrUpdateReplyDto) {
    return this.repliesService.upsert(id, dto);
  }

  @Post('publish')
  publish(@Param('id') id: string) {
    return this.repliesService.publish(id);
  }

  @Delete()
  remove(@Param('id') id: string) {
    return this.repliesService.remove(id);
  }
}
