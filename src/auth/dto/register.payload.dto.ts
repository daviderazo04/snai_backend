import { IsEmail, IsNotEmpty } from 'class-validator';

export class RegisterPayloadDto {
  @IsEmail()
  @IsNotEmpty()
  correo: string;
  @IsNotEmpty()
  password: string;
  @IsNotEmpty()
  nombre: string;
  @IsNotEmpty()
  apellido: string;
}
