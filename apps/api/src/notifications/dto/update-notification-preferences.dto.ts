import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsOptional, IsString, Matches } from 'class-validator';

export class UpdateNotificationPreferencesDto {
  @ApiPropertyOptional({
    description: 'Activer/désactiver les notifications par email',
  })
  @IsBoolean()
  @IsOptional()
  emailEnabled?: boolean;

  @ApiPropertyOptional({
    description: 'Activer/désactiver les notifications par SMS',
  })
  @IsBoolean()
  @IsOptional()
  smsEnabled?: boolean;

  @ApiPropertyOptional({
    description: 'Numéro de téléphone au format E.164 (ex: +33612345678)',
    example: '+33612345678',
  })
  @IsString()
  @IsOptional()
  @Matches(/^\+[1-9]\d{1,14}$/, {
    message:
      'Le numéro de téléphone doit respecter le format international E.164 (ex: +33612345678)',
  })
  phoneNumber?: string;
}
