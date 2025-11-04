import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class LoginPayloadDto {
  @ApiProperty({
    example: 'usuario@correo.com',
    description: 'Correo electrónico registrado del usuario',
  })
  @IsEmail()
  @IsNotEmpty()
  correo: string;

  @ApiProperty({
    example: 'Password123',
    description: 'Contraseña asociada al correo electrónico',
  })
  @IsNotEmpty()
  password: string;
}
