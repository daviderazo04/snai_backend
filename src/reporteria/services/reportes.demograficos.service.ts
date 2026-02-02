import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Adolescente } from '../../adolescente/entities/adolescente.entity';
import { Repository } from 'typeorm';
import { ReportResult } from '../ReportResult';
import { Stat } from '../stat';
import { ReportMatrixResult, ReportMatrixItem } from '../report-matrix.result';

@Injectable()
export class ReportesDemograficosService {
  constructor(
    @InjectRepository(Adolescente)
    private readonly adolescenteRepository: Repository<Adolescente>,
  ) {}
  async getReporteDemograficoEtnia() {
    const result = await this.adolescenteRepository
      .createQueryBuilder('adolescente')
      .select('COUNT(adolescente.id)', 'data')
      .addSelect('etnia.nombre', 'etiqueta')
      .innerJoin('adolescente.etnia', 'etnia')
      .groupBy('etnia.nombre')
      .getRawMany<Stat>();
    const stats = new ReportResult();
    stats.etiquetas = [];
    stats.data = [];
    for (const item of result) {
      stats.etiquetas.push(item.etiqueta);
      stats.data.push(Number(item.data));
    }
    stats.titulo = 'Etnia';
    return stats;
  }

  // ---------------------------------------------------------
  // REPORTE 1: NACIONALIDAD POR CAI (Imagen image_48ad3f)
  // ---------------------------------------------------------
  async getReporteNacionalidadPorCai() {
    const result = await this.adolescenteRepository
      .createQueryBuilder('adolescente')
      .select('cai.nombre', 'cai')
      .addSelect('nacionalidad.nombre', 'nacionalidad')
      .addSelect('COUNT(adolescente.id)', 'cantidad')
      .innerJoin('adolescente.cai', 'cai')
      .innerJoin('adolescente.nacionalidad', 'nacionalidad') 
      .groupBy('cai.nombre')
      .addGroupBy('nacionalidad.nombre')
      .getRawMany();

    return this.mapToMatrix(result, 'cai', 'nacionalidad', 'Reporte Nacionalidad por CAI');
  }

  // ---------------------------------------------------------
  // REPORTE 2: EDAD POR CAI (Imagen image_48ad65)
  // ---------------------------------------------------------
  async getReporteEdadPorCai() {
    const result = await this.adolescenteRepository
      .createQueryBuilder('adolescente')
      .select('EXTRACT(YEAR FROM AGE(adolescente.fecha_nac))', 'edad') 
      .addSelect('cai.nombre', 'cai')
      .addSelect('COUNT(adolescente.id)', 'cantidad')
      .innerJoin('adolescente.cai', 'cai')
      .groupBy('edad')
      .addGroupBy('cai.nombre')
      .orderBy('edad', 'ASC')
      .getRawMany();

    // Nota: El driver puede devolver 'edad' como string, se maneja en el map
    return this.mapToMatrix(result, 'edad', 'cai', 'Reporte Edad por CAI');
  }

  // ---------------------------------------------------------
  // REPORTE 3: TIPO DE INFRACCIÓN (DELITO) POR CAI (Imagen image_48ad9c)
  // ---------------------------------------------------------
  async getReporteDelitoPorCai() {
    const result = await this.adolescenteRepository
      .createQueryBuilder('adolescente')
      .select('delito.nombre', 'infraccion')
      .addSelect('cai.nombre', 'cai')
      .addSelect('COUNT(adolescente.id)', 'cantidad')
      .innerJoin('adolescente.cai', 'cai')
      .innerJoin('adolescente.juridico', 'juridico') 
      .innerJoin('juridico.delito', 'delito') 
      .groupBy('delito.nombre')
      .addGroupBy('cai.nombre')
      .getRawMany();

    return this.mapToMatrix(result, 'infraccion', 'cai', 'Reporte Infracción por CAI');
  }

  // ---------------------------------------------------------
  // REPORTE 4: MEDIDAS POR CAI (Imagen image_48ad46)
  // ---------------------------------------------------------
  async getReporteMedidasPorCai() {
    const result = await this.adolescenteRepository
      .createQueryBuilder('adolescente')
      .select('cai.nombre', 'cai')
      .addSelect('juridico.medidas', 'medida') 
      .addSelect('COUNT(adolescente.id)', 'cantidad')
      .innerJoin('adolescente.cai', 'cai')
      .innerJoin('adolescente.juridico', 'juridico')
      .groupBy('cai.nombre')
      .addGroupBy('juridico.medidas')
      .getRawMany();

    return this.mapToMatrix(result, 'cai', 'medida', 'Reporte Medidas por CAI');
  }

  private mapToMatrix(data: any[], keyX: string, keyY: string, titulo: string): ReportMatrixResult {
    const response = new ReportMatrixResult();
    response.titulo = titulo;
    response.data = data.map(item => ({
      ejeX: item[keyX] ? String(item[keyX]) : 'Sin definir', 
      ejeY: item[keyY] ? String(item[keyY]) : 'Sin definir',
      cantidad: Number(item.cantidad)
    }));
    return response;
  }
}
