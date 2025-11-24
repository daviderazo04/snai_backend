import { ApiProperty } from '@nestjs/swagger';

export class PaginatedResult<T> {
  @ApiProperty({
    description: 'Los datos en forma de arreglo',
    example: true,
  })
  data: T[];
  @ApiProperty({
    description: 'Indica el total de paginas',
    example: true,
  })
  totalPages: number;
  @ApiProperty({
    description: 'Indica el numero de pagina actual',
    example: true,
  })
  page: number;
  @ApiProperty({
    description: 'Indica el numero de elementos por pagina',
    example: true,
  })
  pageSize: number;
  constructor(data: T[], totalPages: number, page: number, pageSize: number) {
    this.data = data;
    this.totalPages = totalPages;
    this.page = page;
    this.pageSize = pageSize;
  }
}
