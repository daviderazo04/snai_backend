import { ApiProperty } from '@nestjs/swagger';

export class PaginatedResult<T> {
  @ApiProperty({
    description: 'Los datos en forma de arreglo',
    isArray: true,
    type: Object,
  })
  data: T[];

  @ApiProperty({
    description: 'Indica el total de paginas',
    example: 5,
  })
  totalPages: number;

  @ApiProperty({
    description: 'Indica el numero de pagina actual',
    example: 1,
  })
  page: number;

  @ApiProperty({
    description: 'Indica el numero de elementos por pagina',
    example: 10,
  })
  pageSize: number;

  constructor(data: T[], totalPages: number, page: number, pageSize: number) {
    this.data = data;
    this.totalPages = totalPages;
    this.page = page;
    this.pageSize = pageSize;
  }
}
