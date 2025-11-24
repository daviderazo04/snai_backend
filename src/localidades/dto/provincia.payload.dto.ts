import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ProvinciaPayloadDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    example: 'Pichincha',
    description: 'Nombre de la provincia',
  })
  nombre: string;
}
