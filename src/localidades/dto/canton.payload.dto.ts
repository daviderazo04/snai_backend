import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CantonPayload {
  @ApiProperty({})
  @IsString()
  @IsNotEmpty()
  nombre: string;
  @ApiProperty({})
  @IsNotEmpty()
  @IsNumber()
  provinciaId: number;
}
