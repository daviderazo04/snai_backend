import { ApiProperty } from '@nestjs/swagger';
import { JwtUser } from '../../common/jwt/JWTUser';
import { PerfilDto } from './perfil.dto';

export class LoginResponseData {
  @ApiProperty({
    description: 'Token JWT que debe utilizarse en el encabezado Authorization',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
  })
  accessToken: string;

  @ApiProperty({
    description:
      'Informacion del usuario autenticado incluida en el token; incluye perfilActivo si se selecciono uno',
    type: () => JwtUser,
  })
  user: JwtUser;

  @ApiProperty({
    description: 'Perfiles disponibles para el usuario autenticado',
    type: () => PerfilDto,
    isArray: true,
    example: [
      { id: 1, nombre: 'Administrador' },
      { id: 2, nombre: 'Consulta' },
    ],
  })
  posiblesPerfiles: PerfilDto[];

  constructor(
    accessToken: string,
    user: JwtUser,
    posiblesPerfiles: PerfilDto[],
  ) {
    this.accessToken = accessToken;
    this.user = user;
    this.posiblesPerfiles = posiblesPerfiles;
  }
}
