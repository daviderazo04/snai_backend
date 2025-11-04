import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class RegisterPayloadDto {
  @ApiProperty({
    example: 'nuevo.usuario@correo.com',
    description: 'Correo electrónico único del usuario a registrar',
  })
  @IsEmail()
  @IsNotEmpty()
  correo: string;

  @ApiProperty({
    example: 'Password123',
    description: 'Contraseña que deberá cumplir con las políticas de seguridad',
  })
  @IsNotEmpty()
  password: string;

  @ApiProperty({
    example: 'Juan',
    description: 'Nombre del usuario',
  })
  @IsNotEmpty()
  nombre: string;

  @ApiProperty({
    example: 'Pérez',
    description: 'Apellido del usuario',
  })
  @IsNotEmpty()
  apellido: string;
}
