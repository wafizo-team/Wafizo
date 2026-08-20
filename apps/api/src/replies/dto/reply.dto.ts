import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateReplyDto {
  @ApiProperty({ description: 'Contenu du texte de la réponse' })
  @IsString()
  @IsNotEmpty()
  content: string;
}
