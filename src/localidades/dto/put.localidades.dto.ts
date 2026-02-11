import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
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
export class PutCaiDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    example: 'Pichincha',
    description: 'Nombre nuevo',
  })
  nombre: string;
  @IsNumber()
  @IsOptional()
  @ApiProperty({
    example: '1',
    description: 'Id del canton',
  })
  cantonId?: number;
}
