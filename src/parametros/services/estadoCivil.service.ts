import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EstadoCivil } from '../entities/estadoCivil';
import { ParamPayload } from '../dto/param.payload';
import { ResultWithData } from '../../common/dto/result.dto';
import { PaginatedResult } from '../../common/dto/paginated.result.dto';

@Injectable()
export class EstadoCivilService {
  constructor(
    @InjectRepository(EstadoCivil)
    private estadoCivilRepository: Repository<EstadoCivil>,
  ) {}
  async getPaginatedEstadoCivil(
    nombre: string = '',
    page: number = 1,
    size: number = 10,
  ): Promise<PaginatedResult<EstadoCivil>> {
    if (nombre == '') {
      const [estadoCivils, totales] =
        await this.estadoCivilRepository.findAndCount({
          take: size,
          skip: (page - 1) * size,
        });
      const totalPages = Math.ceil(totales / size);
      return new PaginatedResult(estadoCivils, totalPages, page, size);
    } else {
      const [estadoCivils, totales] =
        await this.estadoCivilRepository.findAndCount({
          where: { nombre: nombre },
          take: size,
          skip: (page - 1) * size,
        });
      const totalPages = Math.ceil(totales / size);
      return new PaginatedResult(estadoCivils, totalPages, page, size);
    }
  }
  async createEstadoCivil(
    payload: ParamPayload,
  ): Promise<ResultWithData<EstadoCivil>> {
    const estadoCivil = this.estadoCivilRepository.create({
      nombre: payload.nombre,
    });
    const savedEstadoCivil = await this.estadoCivilRepository.save(estadoCivil);
    return new ResultWithData<EstadoCivil>(
      true,
      'Estado civil creado exitosamente',
      savedEstadoCivil,
    );
  }
}
