import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class EventoDto {
  @ApiProperty({ description: 'Nombre del evento', example: 'Visita' })
  @IsNotEmpty()
  @IsString()
  nombre: string;
}
