import {
  Body,
  Controller,
  Delete,
  Param,
  Post,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UpdateReplyDto } from './dto/reply.dto';
import { RepliesService } from './replies.service';

interface AuthenticatedRequest extends Request {
  user: { id: string };
}

@ApiTags('Replies')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('reviews/:reviewId/reply')
export class RepliesController {
  constructor(private readonly repliesService: RepliesService) {}

  @Post('generate')
  @ApiOperation({
    summary: 'Générer une suggestion de réponse avec contrôle des quotas IA',
  })
  generate(
    @Req() req: AuthenticatedRequest,
    @Param('reviewId') reviewId: string,
  ) {
    return this.repliesService.generateReply(req.user.id, reviewId);
  }

  @Put()
  @ApiOperation({ summary: 'Créer ou mettre à jour le brouillon de réponse' })
  upsert(@Param('reviewId') reviewId: string, @Body() dto: UpdateReplyDto) {
    return this.repliesService.upsertReply(reviewId, dto);
  }

  @Post('publish')
  @ApiOperation({ summary: 'Publier la réponse' })
  publish(@Param('reviewId') reviewId: string) {
    return this.repliesService.publishReply(reviewId);
  }

  @Delete()
  @ApiOperation({ summary: 'Supprimer la réponse d un avis' })
  remove(@Param('reviewId') reviewId: string) {
    return this.repliesService.deleteReply(reviewId);
  }
}
