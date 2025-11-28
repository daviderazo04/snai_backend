import { IsNotEmpty, IsString } from 'class-validator';

export class ParamPayload {
  @IsString()
  @IsNotEmpty()
  nombre: string;
}
