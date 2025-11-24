import { IsBoolean, IsNotEmpty, IsString } from 'class-validator';

export class PerfilPayloadDto {
  @IsNotEmpty()
  @IsString()
  nombre: string;
  @IsNotEmpty()
  @IsString()
  descripcion: string;
  @IsNotEmpty()
  permisos: PermisoEndpointDto[];
}
export class PermisoEndpointDto {
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
