import { Permiso } from '../entities/permisos.entity';
import { Perfil } from '../entities/perfil.entity';

export class PerfilFlatResponseDto {
  id: number;
  nombre: string;
  descripcion: string;
  permisos: PermisoFlatResponseDto[];
  constructor(perfil: Perfil, permisos: PermisoFlatResponseDto[]) {
    this.id = perfil.id;
    this.nombre = perfil.nombre;
    this.descripcion = perfil.descripcion;
    this.permisos = permisos;
  }
}
export class PermisoFlatResponseDto {
  endpoint: string;
  descripcion: string;
  VIEW: boolean;
  EDIT: boolean;
  constructor(
    endpoint: string,
    VIEW: boolean,
    EDIT: boolean,
    descripcion: string,
  ) {
    this.endpoint = endpoint;
    this.VIEW = VIEW;
    this.EDIT = EDIT;
    this.descripcion = descripcion;
  }
  fromPermiso(permiso: Permiso): PermisoFlatResponseDto {
    return new PermisoFlatResponseDto(
      permiso.endpoint.endpoint,
      permiso.VIEW,
      permiso.EDIT,
      permiso.endpoint.descripcion,
    );
  }
}
