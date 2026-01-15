import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Adolescente } from '../../adolescente/entities/adolescente.entity';
import { Repository } from 'typeorm';
import { ReportResult } from '../ReportResult';
import { Stat } from '../stat';

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
}
