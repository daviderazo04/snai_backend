import { ApiProperty } from '@nestjs/swagger';
import { Request } from 'express';
import { Usuario } from '../../usuario/entities/usuario.entity';
//Esta clase es la que se codifica en el JWT, cualquier cosa que se quiere enviar ahi debe refelajrse aca
//Recive solo el usuario como entrada e internamnte mapae lo necesario
export class JwtUser {
  constructor(user: Usuario) {
    this.id = user.id;
    this.correo = user.correo;
    this.nombre = user.nombre;
    this.apellido = user.apellido;
  }
  @ApiProperty({ description: 'Identificador único del usuario', example: 1 })
  public id: number;

  @ApiProperty({
    description: 'Correo electrónico del usuario',
    example: 'usuario@correo.com',
  })
  public correo: string;

  @ApiProperty({ description: 'Nombre del usuario', example: 'Juan' })
  public nombre: string;

  @ApiProperty({ description: 'Apellido del usuario', example: 'Pérez' })
  public apellido: string;

  public toPlainObject() {
    return {
      id: this.id,
      correo: this.correo,
      nombre: this.nombre,
      apellido: this.apellido,
    };
  }
}
export interface AuthenticatedRequest extends Request {
  user: JwtUser;
}
