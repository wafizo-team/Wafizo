import { Body, Controller, Get, Put, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UpdateNotificationPreferencesDto } from './dto/update-notification-preferences.dto';
import { NotificationsService } from './notifications.service';

interface AuthenticatedRequest extends Request {
  user: { id: string };
}

@ApiTags('Notifications')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('me/notification-preferences')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Get()
  @ApiOperation({
    summary:
      'Récupérer les préférences de notification de l utilisateur connecté',
  })
  getPreferences(@Req() req: AuthenticatedRequest) {
    return this.notificationsService.getPreferences(req.user.id);
  }

  @Put()
  @ApiOperation({ summary: 'Mettre à jour les préférences de notification' })
  updatePreferences(
    @Req() req: AuthenticatedRequest,
    @Body() dto: UpdateNotificationPreferencesDto,
  ) {
    return this.notificationsService.updatePreferences(req.user.id, dto);
  }
}
