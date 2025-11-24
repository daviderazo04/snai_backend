import { IsBoolean, IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class PerfilPayloadDto {
  @ApiProperty({
    example: 'Administrador',
    description: 'Nombre del perfil',
  })
  @IsNotEmpty()
  @IsString()
  nombre: string;
  @ApiProperty({
    example: 'Administrador de la plataforma',
    description: 'Descripcion del perfil',
  })
  @IsNotEmpty()
  @IsString()
  descripcion: string;
  @ApiProperty({
    example: [{ endpoint: '/endpoint', VIEW: true, EDIT: true }],
    description: 'Lista de permisos del perfil',
  })
  @IsNotEmpty()
  permisos: PermisoDto[];
}
export class PermisoDto {
  @IsNotEmpty()
  @IsString()
  endpoint: string;
  @IsNotEmpty()
  @IsBoolean()
  VIEW: boolean;
  @IsNotEmpty()
  @IsBoolean()
  EDIT: boolean;
}
