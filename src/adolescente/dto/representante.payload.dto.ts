import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class RepresentantePayloadDto {
  @ApiProperty({
    description: 'Identificador de la nacionalidad del representante',
    example: 1,
  })
  @IsNotEmpty()
  @IsNumber()
  nacionalidadId: number;

  @ApiProperty({
    description: 'Identificador del parentesco del representante',
    example: 2,
  })
  @IsNotEmpty()
  @IsNumber()
  parentescoId: number;

  @ApiProperty({
    description: 'Identificador del cantón del representante',
    example: 3,
  })
  @IsNotEmpty()
  @IsNumber()
  cantonId: number;

  @ApiProperty({ description: 'Nombre del representante', example: 'Pedro' })
  @IsNotEmpty()
  @IsString()
  nombre: string;

  @ApiProperty({ description: 'Apellido del representante', example: 'Gomez' })
  @IsNotEmpty()
  @IsString()
  apellido: string;

  @ApiProperty({
    description: 'Cédula del representante',
    example: '1714875214',
  })
  @IsNotEmpty()
  @IsString()
  cedula: string;
}
