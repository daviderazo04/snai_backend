import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class PerfilDto {
  @ApiProperty({ description: 'Identificador unico del perfil', example: 1 })
  @IsNumber()
  @IsNotEmpty()
  id: number;

  @ApiProperty({ description: 'Nombre legible del perfil', example: 'Admin' })
  @IsString()
  @IsOptional()
  nombre: string;

  constructor(id: number, nombre: string) {
    this.nombre = nombre;
    this.id = id;
  }
}
