import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class PutLocalidadesDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    example: 'Pichincha',
    description: 'Nombre nuevo',
  })
  nombre: string;
}
