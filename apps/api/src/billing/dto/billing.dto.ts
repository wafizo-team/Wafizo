import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateCheckoutSessionDto {
  @ApiProperty({
    example: 'price_1234567890',
    description: 'ID du prix Stripe',
  })
  @IsString()
  @IsNotEmpty()
  priceId: string;
}
