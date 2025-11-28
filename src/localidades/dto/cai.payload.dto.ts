import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CaiPayloadDto {
  @ApiProperty({ description: 'Nombre del CAI', example: 'CAI Central' })
  @IsNotEmpty()
  @IsString()
  nombre: string;

  @ApiProperty({
    description: 'Identificador del cantón al que pertenece',
    example: 1,
  })
  @IsNotEmpty()
  @IsNumber()
  cantonId: number;
}
