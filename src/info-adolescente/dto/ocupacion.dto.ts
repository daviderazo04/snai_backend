import { ApiProperty } from '@nestjs/swagger';
import {
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  Min,
} from 'class-validator';

export class CreateOcupacionDto {
  @ApiProperty({ description: 'ID del adolescente asociado', example: 1 })
  @IsNumber()
  @IsNotEmpty()
  adolescenteId: number;

  @ApiProperty({
    description: 'Nombre del taller o actividad',
    maxLength: 255,
    example: 'Carpintería',
  })
  @IsString()
  @MaxLength(255)
  @IsNotEmpty()
  taller: string;

  @ApiProperty({
    description: 'Cantidad de participaciones o asistencias',
    example: 0,
    minimum: 0,
  })
  @IsInt()
  @Min(0)
  @IsOptional()
  participacion?: number;

  @ApiProperty({
    description: 'Nombre del instructor encargado',
    maxLength: 63,
    required: false,
  })
  @IsString()
  @MaxLength(63)
  @IsOptional()
  instructor?: string;

  @ApiProperty({
    description: 'Observaciones generales del desempeño',
    maxLength: 255,
    required: false,
  })
  @IsString()
  @MaxLength(255)
  @IsOptional()
  observacion?: string;
}
