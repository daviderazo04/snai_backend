import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsNumberString,
  IsPhoneNumber,
  IsString,
  MaxLength,
} from 'class-validator';
import { Sexo } from '../../common/enums/sexo.enums';

export class RegisterPayloadDto {
  @ApiProperty({
    example: '0954321876',
    description: 'Cédula única del usuario a registrar',
  })
  @IsNumberString()
  @MaxLength(10)
  @IsNotEmpty()
  cedula: string;

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

  @ApiProperty({
    enum: Sexo,
    example: Sexo.MASCULINO,
    description: 'Sexo del usuario según catálogo permitido',
  })
  @IsEnum(Sexo)
  @IsString()
  sexo: Sexo;

  @ApiProperty({
    example: 'Av. Siempre Viva 123',
    description: 'Dirección física de residencia',
  })
  @IsNotEmpty()
  direccion: string;

  @ApiProperty({
    example: '+593991112233',
    description: 'Número de teléfono en formato internacional',
  })
  @IsNotEmpty()
  @IsPhoneNumber('EC')
  telefono: string;
}
