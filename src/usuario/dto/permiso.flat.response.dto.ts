import { Permiso } from '../entities/permisos.entity';
import { Perfil } from '../entities/perfil.entity';
import { Usuario } from '../entities/usuario.entity';
export class UsuarioWithPerfilFlatResponseDto {
  id: number;
  nombre: string;
  apellido: string;
  correo: string;
  estado: string;
  createdAt: Date;
  updatedAt: Date;
  perfiles: PerfilFlatResponseDto[];

  constructor(
    usuario: Usuario,

    perfiles: PerfilFlatResponseDto[],
  ) {
    this.id = usuario.id;
    this.nombre = usuario.nombre;
    this.apellido = usuario.apellido;
    this.correo = usuario.correo;
    this.estado = usuario.estado.toString();
    this.createdAt = usuario.createdAt;
    this.updatedAt = usuario.updatedAt;
    this.perfiles = perfiles;
  }
}
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
