import { ApiProperty } from '@nestjs/swagger';
import {
  IsDateString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
} from 'class-validator';

export class RepInfractorPayloadDto {
  @ApiProperty({
    description: 'Identificador del adolescente infractor',
    example: 1,
  })
  @IsNotEmpty()
  @IsNumber()
  adolescenteId: number;

  @ApiProperty({
    description: 'Identificador del representante legal',
    example: 2,
  })
  @IsNotEmpty()
  @IsNumber()
  representanteId: number;

  @ApiProperty({
    description: 'Fecha de inicio de representación',
    example: '2008-05-20',
    type: String,
    format: 'date',
  })
  @IsNotEmpty()
  @IsDateString()
  fechaInicio: string;

  @ApiProperty({
    description: 'Fecha de fin de representación',
    example: '2018-05-20',
    type: String,
    format: 'date',
    required: false,
  })
  @IsOptional()
  @IsDateString()
  fechaFin?: string;
}
