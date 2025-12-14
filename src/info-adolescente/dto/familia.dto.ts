import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsNumber,
  IsString,
  MaxLength,
  IsDateString,
} from 'class-validator';

export class FamiliaDto {
  @ApiProperty({ description: 'ID del adolescente asociado', example: 1 })
  @IsNumber()
  @IsNotEmpty()
  adolescenteId: number;

  @ApiProperty({ description: 'ID del evento asociado', example: 1 })
  @IsNumber()
  @IsNotEmpty()
  eventoId: number;

  @ApiProperty({
    description: 'Fecha de la interacción con la familia',
    example: '2024-05-20',
  })
  @IsDateString()
  @IsNotEmpty()
  fecha: Date;

  @ApiProperty({
    description: 'Detalle de la interacción',
    maxLength: 255,
    example: 'Visita domiciliaria realizada para seguimiento',
  })
  @IsString()
  @MaxLength(255)
  @IsNotEmpty()
  detalle?: string;
}
