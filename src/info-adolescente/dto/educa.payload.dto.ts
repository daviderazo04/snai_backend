import { ApiProperty } from '@nestjs/swagger';
import {
  IsDateString,
  IsIn,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

export class EducaPayloadDto {
  @ApiProperty({
    description: 'Identificador del adolescente asociado',
    example: 1,
  })
  @IsNotEmpty()
  @IsNumber()
  adolescenteId: number;

  @ApiProperty({
    description: 'Fecha del registro educativo',
    example: '2023-10-25',
    type: String,
    format: 'date',
  })
  @IsNotEmpty()
  @IsDateString()
  fecha: string;

  @ApiProperty({
    description: '¿Estudia actualmente? (0 o 1)',
    example: '1',
  })
  @IsNotEmpty()
  @IsString()
  @IsIn(['0', '1'])
  estudia: string;

  @ApiProperty({
    description: 'Razón por la cual no estudia (si aplica)',
    example: 'Falta de recursos o desinterés',
    required: false,
  })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  razonNoEstudia: string;

  @ApiProperty({
    description: 'Nivel educativo actual',
    example: 'Bachillerato',
    required: false,
  })
  @IsOptional()
  @IsString()
  @MaxLength(127)
  nivel: string;

  @ApiProperty({
    description: 'Ciclo académico que cursa',
    example: 'Segundo de Bachillerato',
    required: false,
  })
  @IsOptional()
  @IsString()
  @MaxLength(63)
  cicloAcademico: string;

  @ApiProperty({
    description: 'Carrera o especialización',
    example: 'Ciencias Físico-Matemáticas',
    required: false,
  })
  @IsOptional()
  @IsString()
  @MaxLength(127)
  carrera: string;

  @ApiProperty({
    description: 'Nombre de la institución educativa',
    example: 'Colegio Nacional Central',
    required: false,
  })
  @IsOptional()
  @IsString()
  @MaxLength(127)
  institucion: string;

  @ApiProperty({
    description: 'Modalidad de estudio',
    example: 'Presencial',
    required: false,
  })
  @IsOptional()
  @IsString()
  @MaxLength(15)
  modalidad: string;

  @ApiProperty({
    description: 'Contacto o teléfono de la institución',
    example: '022345678',
    required: false,
  })
  @IsOptional()
  @IsString()
  @MaxLength(63)
  contacto: string;

  @ApiProperty({
    description: 'Observaciones adicionales',
    example: 'El adolescente muestra interés en matemáticas.',
    required: false,
  })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  observacion: string;
}