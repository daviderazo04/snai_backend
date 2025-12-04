import { IsString } from 'class-validator';

export class ProvinciaUpdatePayloadDto {
  @IsString()
  nombre: string;
}
