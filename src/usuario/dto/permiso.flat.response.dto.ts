import { Permiso } from '../entities/permisos.entity';

export class PermisoFlatResponseDto {
  endpoint: string;
  VIEW: boolean;
  EDIT: boolean;
  constructor(endpoint: string, VIEW: boolean, EDIT: boolean) {
    this.endpoint = endpoint;
    this.VIEW = VIEW;
    this.EDIT = EDIT;
  }
  fromPermiso(permiso: Permiso): PermisoFlatResponseDto {
    return new PermisoFlatResponseDto(
      permiso.endpoint.endpoint,
      permiso.VIEW,
      permiso.EDIT,
    );
  }
}
