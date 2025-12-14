import { ApiProperty } from '@nestjs/swagger';

export class EndpointFlatResponseDto {
  @ApiProperty({
    description: 'Ruta expuesta por la API',
    example: '/endpoints',
  })
  endpoint: string;

  @ApiProperty({
    description: 'Nombre o descripción legible del endpoint',
    example: 'Listado de endpoints aplanados',
  })
  descripcion: string;

  constructor(endpoint: string, descripcion: string) {
    this.endpoint = endpoint;
    this.descripcion = descripcion;
  }
}
