import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class DelitoDto {
  @ApiProperty({ description: 'Nombre del delito', example: 'Robo' })
  @IsNotEmpty()
  @IsString()
  nombre: string;
}
