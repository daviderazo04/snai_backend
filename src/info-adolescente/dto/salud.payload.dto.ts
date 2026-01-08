import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsIn, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class SaludPayloadDto {
  @ApiProperty({ description: 'ID del adolescente asociado', example: 1 })
  @IsNotEmpty()
  @IsNumber()
  adolescenteId: number;

  @ApiProperty({ description: 'Fecha del registro médico', example: '2023-10-25', type: String, format: 'date' })
  @IsNotEmpty()
  @IsDateString()
  fecha: string;

  @ApiProperty({ description: 'Diagnóstico médico', example: 'Gripe estacional' })
  @IsOptional()
  @IsString()
  diagnostico: string;

  @ApiProperty({ description: '¿Toma medicación? (0 o 1)', example: '1' })
  @IsNotEmpty()
  @IsString()
  @IsIn(['0', '1'])
  tomaMedicacion: string;

  @ApiProperty({ description: '¿Consume sustancias? (0 o 1)', example: '0' })
  @IsNotEmpty()
  @IsString()
  @IsIn(['0', '1'])
  consumeSustancia: string;

  @ApiProperty({ description: 'Tipo de sustancia consumida', example: 'Ninguna' })
  @IsOptional()
  @IsString()
  tipoSustancia: string;

  @ApiProperty({ description: 'Número de atenciones médicas', example: 1 })
  @IsNumber()
  numAtenMedica: number;

  @ApiProperty({ description: '¿Tiene discapacidad? (0 o 1)', example: '0' })
  @IsNotEmpty()
  @IsString()
  @IsIn(['0', '1'])
  discapacidad: string;

  @ApiProperty({ description: 'Observaciones', example: 'Paciente estable' })
  @IsOptional()
  @IsString()
  observacion: string;
}