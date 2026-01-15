import { ApiProperty } from '@nestjs/swagger';

export class ReportResult {
  @ApiProperty({
    description: 'Título del reporte',
    example: 'Reporte de Adolescentes por Género',
  })
  titulo: string;

  @ApiProperty({
    description: 'Etiquetas o categorías del reporte',
    example: ['Masculino', 'Femenino', 'Otro'],
    type: [String],
  })
  etiquetas: string[];

  @ApiProperty({
    description: 'Datos numéricos del reporte',
    example: [45, 32, 5],
    type: [Number],
  })
  data: number[];
}
