import { IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class PerfilAsignarPayload {
  @ApiProperty({
    isArray: true,
    type: Number,
  })
  @IsNotEmpty()
  perfiles: number[];
}
