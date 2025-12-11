import { Permiso } from '../entities/permisos.entity';

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
