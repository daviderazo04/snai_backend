import { ApiProperty } from '@nestjs/swagger';
import { JwtUser } from '../../common/jwt/JWTUser';

export class LoginResponseData {
  @ApiProperty({
    description: 'Token JWT que debe utilizarse en el encabezado Authorization',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
  })
  accessToken: string;

  @ApiProperty({
    description: 'Información del usuario autenticado incluida en el token',
    type: () => JwtUser,
  })
  user: JwtUser;

  constructor(accessToken: string, user: JwtUser) {
    this.accessToken = accessToken;
    this.user = user;
  }
}
