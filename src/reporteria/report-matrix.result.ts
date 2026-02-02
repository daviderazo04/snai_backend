import { ApiProperty } from '@nestjs/swagger';

export class ReportMatrixItem {
  @ApiProperty({ description: 'La categoría principal (Ej: Nombre del CAI o Edad)' })
  ejeX: string;

  @ApiProperty({ description: 'La subcategoría (Ej: Nacionalidad o Delito)' })
  ejeY: string;

  @ApiProperty({ description: 'Cantidad contada' })
  cantidad: number;
}

export class ReportMatrixResult {
  @ApiProperty({ description: 'Título del reporte' })
  titulo: string;

  @ApiProperty({ type: [ReportMatrixItem] })
  data: ReportMatrixItem[];
}