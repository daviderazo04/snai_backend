import { Usuario } from '../../usuario/entities/usuario.entity';
import { Role } from '../../usuario/entities/usuario.roles.enum';
//Esta clase es la que se codifica en el JWT, cualquier cosa que se quiere enviar ahi debe refelajrse aca
//Recive solo el usuario como entrada e internamnte mapae lo necesario
export class JwtUser {
  constructor(user: Usuario) {
    this.id = user.id;
    this.correo = user.correo;
    this.nombre = user.nombre;
    this.apellido = user.apellido;
    this.roles = user.roles;
  }
  public id: number;
  public correo: string;
  public nombre: string;
  public apellido: string;
  public roles: Role[];

  public toPlainObject() {
    return {
      id: this.id,
      correo: this.correo,
      nombre: this.nombre,
      apellido: this.apellido,
      roles: this.roles,
    };
  }
}
export interface AuthenticatedRequest extends Request {
  user: JwtUser;
}
