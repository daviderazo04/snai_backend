import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumberString, MaxLength } from 'class-validator';

export class LoginPayloadDto {
  @ApiProperty({
    example: '0954321876',
    description: 'Cédula registrada del usuario',
  })
  @IsNumberString()
  @MaxLength(10)
  @IsNotEmpty()
  cedula: string;

  @ApiProperty({
    example: 'Password123',
    description: 'Contraseña asociada a la cédula del usuario',
  })
  @IsNotEmpty()
  password: string;
}
