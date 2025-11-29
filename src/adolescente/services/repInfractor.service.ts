import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RepInfractor } from '../entities/repInfractor.entity';
import { Adolescente } from '../entities/adolescente.entity';
import { Representante } from '../entities/representante.entity';
import { RepInfractorPayloadDto } from '../dto/repInfractor.payload.dto';
import { ResultWithData } from 'src/common/dto/result.dto';
import { PaginatedResult } from 'src/common/dto/paginated.result.dto';

@Injectable()
export class RepInfractorService {
  constructor(
    @InjectRepository(RepInfractor)
    private readonly repInfractorRepository: Repository<RepInfractor>,
    @InjectRepository(Adolescente)
    private readonly adolescenteRepository: Repository<Adolescente>,
    @InjectRepository(Representante)
    private readonly representanteRepository: Repository<Representante>,
  ) {}

  async createRepInfractor(
    payload: RepInfractorPayloadDto,
  ): Promise<ResultWithData<RepInfractor>> {
    try {
      const [adolescente, representante] = await Promise.all([
        this.adolescenteRepository.findOne({
          where: { id: payload.adolescenteId },
        }),
        this.representanteRepository.findOne({
          where: { id: payload.representanteId },
        }),
      ]);

      if (!adolescente)
        return new ResultWithData<RepInfractor>(
          false,
          'No existe el adolescente con el id ingresado',
          null,
        );

      if (!representante)
        return new ResultWithData<RepInfractor>(
          false,
          'No existe el representante con el id ingresado',
          null,
        );

      const repInfractor = this.repInfractorRepository.create({
        adolescente,
        representante,
        fechaInicio: new Date(payload.fechaInicio),
        fechaFin: payload.fechaFin ? new Date(payload.fechaFin) : null,
      });

      const saved = await this.repInfractorRepository.save(repInfractor);
      return new ResultWithData<RepInfractor>(
        true,
        'Relación representante-adolescente creada exitosamente',
        saved,
      );
    } catch (error) {
      return new ResultWithData<RepInfractor>(
        false,
        (error as Error).message,
        null,
      );
    }
  }

  async getRepInfractores(
    adolescenteId?: number,
    representanteId?: number,
    page: number = 1,
    size: number = 10,
  ): Promise<PaginatedResult<RepInfractor>> {
    const skip = (page - 1) * size;
    const where: Record<string, unknown> = {};

    if (adolescenteId) where.adolescente = { id: adolescenteId };
    if (representanteId) where.representante = { id: representanteId };

    const [result, total] = await this.repInfractorRepository.findAndCount({
      where,
      take: size,
      skip,
      relations: ['adolescente', 'representante'],
    });

    const totalPages = Math.ceil(total / size);
    return new PaginatedResult(result, totalPages, page, size);
  }
}
