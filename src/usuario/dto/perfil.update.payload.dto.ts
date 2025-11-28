import { IsOptional, IsString } from 'class-validator';
import { PermisoDto } from './perfil.payload.dto';
import { ApiProperty } from '@nestjs/swagger';

export class PerfilUpdatePayloadDto {
  @ApiProperty({
    example: 'Administrador',
    description: 'Nombre del perfil',
  })
  @IsString()
  @IsOptional()
  nombre?: string;
  @ApiProperty({
    example: 'Administrador de la plataforma',
    description: 'Descripcion del perfil',
  })
  @IsString()
  @IsOptional()
  descripcion?: string;
  @ApiProperty({
    example: [{ endpoint: '/endpoint', VIEW: true, EDIT: true }],
    description: 'Lista de permisos del perfil',
  })
  nuevosPermisos: PermisoDto[];
}
