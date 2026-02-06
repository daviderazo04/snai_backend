import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsDateString, IsString, IsNotEmpty } from 'class-validator';
import { Type } from 'class-transformer';

export class TrasladoCreatePayload {
  @ApiProperty({
    description: 'ID del CAI al que se realiza el traslado',
    example: 1,
    type: Number,
  })
  @IsInt({ message: 'El ID del CAI debe ser un número entero' })
  @IsNotEmpty({ message: 'El ID del CAI es obligatorio' })
  @Type(() => Number)
  caiId: number;

  @ApiProperty({
    description: 'ID del adolescente que es trasladado',
    example: 5,
    type: Number,
  })
  @IsInt({ message: 'El ID del adolescente debe ser un número entero' })
  @IsNotEmpty({ message: 'El ID del adolescente es obligatorio' })
  @Type(() => Number)
  adolescenteId: number;

  @ApiProperty({
    description: 'Fecha del traslado',
    example: '2024-01-15',
    type: String,
    format: 'date',
  })
  @IsDateString(
    {},
    { message: 'La fecha debe tener un formato válido (YYYY-MM-DD)' },
  )
  @IsNotEmpty({ message: 'La fecha es obligatoria' })
  fecha: Date;

  @ApiProperty({
    description: 'Observaciones del traslado',
    example: 'Traslado por razones de seguridad',
    type: String,
  })
  @IsString({ message: 'Las observaciones deben ser una cadena de texto' })
  observaciones: string;
}
export class TrasladoUpdatePayload {
  @ApiProperty({
    description: 'ID del CAI al que se realiza el traslado',
    example: 1,
    type: Number,
  })
  @IsInt({ message: 'El ID del CAI debe ser un número entero' })
  @Type(() => Number)
  caiId?: number | null;

  @ApiProperty({
    description: 'Fecha del traslado',
    example: '2024-01-15',
    type: String,
    format: 'date',
  })
  @IsDateString(
    {},
    { message: 'La fecha debe tener un formato válido (YYYY-MM-DD)' },
  )
  fecha?: Date | null;

  @ApiProperty({
    description: 'Observaciones del traslado',
    example: 'Traslado por razones de seguridad',
    type: String,
  })
  @IsString({ message: 'Las observaciones deben ser una cadena de texto' })
  observaciones?: string | null;
}
