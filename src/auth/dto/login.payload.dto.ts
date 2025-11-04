import { IsEmail, IsNotEmpty } from 'class-validator';

export class LoginPayloadDto {
  @IsEmail()
  @IsNotEmpty()
  correo: string;

  @IsNotEmpty()
  password: string;
}
