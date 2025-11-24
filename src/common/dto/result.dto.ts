import { ApiProperty } from '@nestjs/swagger';

export class ResultWithData<T> {
  @ApiProperty({
    description: 'Indica si la operación concluyó exitosamente',
    example: true,
  })
  success: boolean;

  @ApiProperty({
    description: 'Mensaje adicional asociado al resultado',
    example: 'Éxito',
  })
  message: string;

  @ApiProperty({
    description:
      'Datos devueltos por la operación; puede ser nulo cuando no hay información',
    nullable: true,
  })
  data: T | null;

  constructor(success: boolean, message: string, data: T | null) {
    this.success = success;
    this.message = message;
    this.data = data;
  }
}
export class SimpleResult {
  @ApiProperty({
    description: 'Indica si la operación concluyó exitosamente',
    example: true,
  })
  success: boolean;

  @ApiProperty({
    description: 'Mensaje adicional asociado al resultado',
    example: 'Éxito',
  })
  message: string;
  constructor(success: boolean, message: string) {
    this.success = success;
    this.message = message;
  }
}

export function UnauthResponse<T>(data: T): ResultWithData<T> {
  return new ResultWithData<T>(false, 'No tiene el permiso requerido', data);
}
