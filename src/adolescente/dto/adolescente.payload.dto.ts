import { ApiProperty } from '@nestjs/swagger';
import {
  IsDateString,
  IsIn,
  IsNotEmpty,
  IsNumber,
  IsString,
} from 'class-validator';

export class AdolescentePayloadDto {
  @ApiProperty({
    description: 'Identificador del CAI donde se encuentra el adolescente',
    example: 1,
  })
  @IsNotEmpty()
  @IsNumber()
  caiId: number;

  @ApiProperty({
    description: 'Identificador de la nacionalidad del adolescente',
    example: 1,
  })
  @IsNotEmpty()
  @IsNumber()
  nacionalidadId: number;

  @ApiProperty({
    description: 'Identificador del estado civil del adolescente',
    example: 1,
  })
  @IsNotEmpty()
  @IsNumber()
  estadoCivilId: number;

  @ApiProperty({
    description: 'Identificador del grado de instrucción',
    example: 1,
  })
  @IsNotEmpty()
  @IsNumber()
  gdosId: number;

  @ApiProperty({
    description: 'Identificador de la etnia del adolescente',
    example: 1,
  })
  @IsNotEmpty()
  @IsNumber()
  etniaId: number;

  @ApiProperty({
    description: 'Identificador del cantón del adolescente',
    example: 1,
  })
  @IsNotEmpty()
  @IsNumber()
  cantonId: number;

  @ApiProperty({ description: 'Nombre del adolescente', example: 'Juan' })
  @IsNotEmpty()
  @IsString()
  nombre: string;

  @ApiProperty({ description: 'Apellido del adolescente', example: 'Perez' })
  @IsNotEmpty()
  @IsString()
  apellido: string;

  @ApiProperty({
    description: 'Fecha de nacimiento del adolescente',
    example: '2008-05-20',
    type: String,
    format: 'date',
  })
  @IsNotEmpty()
  @IsDateString()
  fecha_nac: string;

  @ApiProperty({
    description: 'Número de hijos del adolescente (si los tiene)',
    example: 2,
  })
  @IsNotEmpty()
  @IsNumber()
  hijos: number;

  @ApiProperty({
    description: 'Fecha de ingreso del adolescente al sistema',
    example: '2018-07-10',
    type: String,
    format: 'date',
  })
  @IsNotEmpty()
  @IsDateString()
  fecha_ingr: string;

  @ApiProperty({ description: 'Cédula del adolescente', example: '1714875214' })
  @IsNotEmpty()
  @IsString()
  cedula: string;

  @ApiProperty({
    description: 'Hijo privado de la libertad (0 o 1)',
    example: '1',
  })
  @IsNotEmpty()
  @IsString()
  @IsIn(['0', '1'])
  hijoPpl: string;

  @ApiProperty({
    description: 'Reincide en el sistema (0 o 1)',
    example: '0',
  })
  @IsNotEmpty()
  @IsString()
  @IsIn(['0', '1'])
  reincide: string;

  @ApiProperty({
    description: 'Observaciones',
    example: 'El adolescente presenta comportamiento...',
  })
  @IsString()
  observaciones: string = '';
}
