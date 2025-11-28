import { ApiProperty } from '@nestjs/swagger';
import { Request } from 'express';
import { Usuario } from '../../usuario/entities/usuario.entity';
import { PerfilDto } from '../../auth/dto/perfil.dto';

// JWT payload for authenticated users
export class JwtUser {
  @ApiProperty({ description: 'Identificador unico del usuario', example: 1 })
  public id: number;

  @ApiProperty({
    description: 'Correo electronico del usuario',
    example: 'usuario@correo.com',
  })
  public correo: string;

  @ApiProperty({ description: 'Nombre del usuario', example: 'Juan' })
  public nombre: string;

  @ApiProperty({ description: 'Apellido del usuario', example: 'Perez' })
  public apellido: string;

  @ApiProperty({
    description: 'Perfil activo seleccionado para el token',
    type: () => PerfilDto,
    nullable: true,
    required: false,
    example: { id: 1, nombre: 'Administrador' },
  })
  public perfilActivo: PerfilDto | null;

  constructor(user: Usuario, perfilActivo?: PerfilDto | null) {
    this.id = user.id;
    this.correo = user.correo;
    this.nombre = user.nombre;
    this.apellido = user.apellido;
    this.perfilActivo = perfilActivo ?? null;
  }

  public toPlainObject() {
    return {
      id: this.id,
      correo: this.correo,
      nombre: this.nombre,
      apellido: this.apellido,
      perfilActivo: this.perfilActivo,
    };
  }
}

export interface AuthenticatedRequest extends Request {
  user: JwtUser;
}
