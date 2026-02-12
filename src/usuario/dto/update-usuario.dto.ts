// update-usuario-informacion.dto.ts
import { IsEmail, IsIn, IsString, Length, Matches } from 'class-validator';

export class UpdateUsuarioInformacionDto {
  @Matches(/^\d{10}$/, { message: 'cedula debe tener 10 dígitos' })
  cedula: string;

  @IsEmail({}, { message: 'correo inválido' })
  correo: string;

  @IsString()
  @Length(2, 80)
  nombre: string;

  @IsString()
  @Length(2, 80)
  apellido: string;

  // Ajusta los valores permitidos según tu sistema (ej: 'M' | 'F' | 'OTRO')
  @IsIn(['M', 'F', 'OTRO'], { message: 'sexo inválido' })
  sexo: string;

  // Ajusta la regla si manejas códigos de país, extensiones, etc.
  @Matches(/^\+?\d{7,15}$/, { message: 'telefono inválido' })
  telefono: string;

  @IsString()
  @Length(5, 200)
  direccion: string;
}
// update-usuario-password.dto.ts

export class UpdateUsuarioPasswordDto {
  @IsString()
  @Length(8, 72, { message: 'password debe tener entre 8 y 72 caracteres' })
  // Opcional (recomendado): al menos 1 mayús, 1 minús, 1 número
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/, {
    message: 'password debe incluir mayúscula, minúscula y número',
  })
  password: string;
}
