import { ApiProperty } from '@nestjs/swagger';
import {
  IsDateString,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  Min,
} from 'class-validator';

export class CreateJuridicoDto {
  // 1. Relación con adolescente
  @ApiProperty({ description: 'ID del Adolescente asociado', example: 1 })
  @IsNumber()
  @IsNotEmpty()
  adolescenteId: number;

  // 2. Relación con delito
  @ApiProperty({ description: 'ID del Delito asociado', example: 1 })
  @IsNumber()
  @IsNotEmpty()
  delitoId: number;

  // 3. Número de la causa
  @ApiProperty({ description: 'Número de la causa', maxLength: 31 })
  @IsString()
  @MaxLength(31)
  @IsNotEmpty()
  numeroCausa: string;

  // 4. Juez
  @ApiProperty({ description: 'Nombre del juez', maxLength: 63 })
  @IsString()
  @MaxLength(63)
  @IsOptional()
  juez?: string;

  // 5. Defensor
  @ApiProperty({ description: 'Nombre del defensor', maxLength: 63 })
  @IsString()
  @MaxLength(63)
  @IsOptional()
  defensor?: string;

  // 6. Fiscal
  @ApiProperty({ description: 'Nombre del fiscal', maxLength: 63 })
  @IsString()
  @MaxLength(63)
  @IsOptional()
  fiscal?: string;

  // 7. Medidas
  @ApiProperty({ description: 'Medidas tomadas', maxLength: 255 })
  @IsString()
  @MaxLength(255)
  @IsOptional()
  medidas?: string;

  // 8. Boleta Preventivo
  @ApiProperty({ description: 'Boleta preventivo', maxLength: 31 })
  @IsString()
  @MaxLength(31)
  @IsOptional()
  boletaPreventivo?: string;

  // 9. Fecha Inicio
  @ApiProperty({
    description: 'Fecha de inicio del proceso',
    example: '2024-05-20',
  })
  @IsDateString()
  @IsNotEmpty()
  fechaInicio: Date;

  // 10. Fecha Audiencia
  @ApiProperty({ description: 'Fecha de la audiencia', example: '2024-06-20' })
  @IsDateString()
  @IsOptional()
  fechaAudiencia?: Date;

  // 11. Boleta Cárcel
  @ApiProperty({ description: 'Boleta cárcel', maxLength: 31 })
  @IsString()
  @MaxLength(31)
  @IsOptional()
  boletaCarcel?: string;

  // 12. Fecha Sentencia
  @ApiProperty({ description: 'Fecha de la sentencia', example: '2024-07-20' })
  @IsDateString()
  @IsOptional()
  fechaSentencia?: Date;

  // 13. Tiempo Año
  @ApiProperty({ description: 'Años de sentencia', example: 1, minimum: 0 })
  @IsInt()
  @Min(0)
  @IsOptional()
  tiempoAnio?: number;

  // 14. Tiempo Mes
  @ApiProperty({ description: 'Meses de sentencia', example: 6, minimum: 0 })
  @IsInt()
  @Min(0)
  @IsOptional()
  tiempoMes?: number;

  // 15. Sentencia Día
  @ApiProperty({ description: 'Días de sentencia', example: 15, minimum: 0 })
  @IsInt()
  @Min(0)
  @IsOptional()
  sentenciaDia?: number;

  // 16. Fecha Fin
  @ApiProperty({
    description: 'Fecha de fin del proceso',
    example: '2026-05-20',
  })
  @IsDateString()
  @IsOptional()
  fechaFin?: Date;

  // 17. Fecha 60
  @ApiProperty({
    description: 'Fecha de cumplimiento del 60%',
    example: '2025-01-01',
  })
  @IsDateString()
  @IsOptional()
  fecha60?: Date;

  // 18. Fecha 80
  @ApiProperty({
    description: 'Fecha de cumplimiento del 80%',
    example: '2025-05-01',
  })
  @IsDateString()
  @IsOptional()
  fecha80?: Date;

  // 19. Rec Apel Mod
  @ApiProperty({
    description: 'Recurso de apelación/modificatoria',
    maxLength: 255,
  })
  @IsString()
  @MaxLength(255)
  @IsOptional()
  recApelMod?: string;

  // 20. Rec Apel Fecha
  @ApiProperty({ description: 'Fecha de la apelación/modificatoria' })
  @IsDateString()
  @IsOptional()
  RecApelFecha?: Date;

  // 21. Casación Recurso
  @ApiProperty({
    description: 'Recurso de casación (1 caracter)',
    maxLength: 1,
  })
  @IsString()
  @MaxLength(1)
  @IsOptional()
  casacionRecurso?: string;

  // 22. Casación Fecha
  @ApiProperty({ description: 'Fecha de casación' })
  @IsDateString()
  @IsOptional()
  casacionFecha?: Date;

  // 23. Egreso Fecha
  @ApiProperty({ description: 'Fecha de egreso' })
  @IsDateString()
  @IsOptional()
  egresoFecha?: Date;

  // 24. Egreso Motivo
  @ApiProperty({ description: 'Motivo de egreso (1 caracter)', maxLength: 255 })
  @IsString()
  @MaxLength(255)
  @IsOptional()
  egresoMotivo?: string;
}
