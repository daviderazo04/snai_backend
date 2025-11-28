import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Nacionalidad } from '../entities/nacionalidad.entity';
import { ParamPayload } from '../dto/param.payload';
import { ResultWithData } from '../../common/dto/result.dto';
import { PaginatedResult } from '../../common/dto/paginated.result.dto';

@Injectable()
export class NacionalidadService {
  constructor(
    @InjectRepository(Nacionalidad)
    private nacionalidadRepository: Repository<Nacionalidad>,
  ) {}
  async getPaginatedNacionalidad(
    nombre: string = '',
    page: number = 1,
    size: number = 10,
  ): Promise<PaginatedResult<Nacionalidad>> {
    if (nombre == '') {
      const [nacionalidades, totales] =
        await this.nacionalidadRepository.findAndCount({
          take: size,
          skip: (page - 1) * size,
        });
      const totalPages = Math.ceil(totales / size);
      return new PaginatedResult(nacionalidades, totalPages, page, size);
    } else {
      const [nacionalidades, totales] =
        await this.nacionalidadRepository.findAndCount({
          where: { nombre: nombre },
          take: size,
          skip: (page - 1) * size,
        });
      const totalPages = Math.ceil(totales / size);
      return new PaginatedResult(nacionalidades, totalPages, page, size);
    }
  }
  async createNacionalidad(
    payload: ParamPayload,
  ): Promise<ResultWithData<Nacionalidad>> {
    const nacionalidad = this.nacionalidadRepository.create({
      nombre: payload.nombre,
    });
    const savedNacionalidad =
      await this.nacionalidadRepository.save(nacionalidad);
    return new ResultWithData<Nacionalidad>(
      true,
      'Nacionalidad creada exitosamente',
      savedNacionalidad,
    );
  }
}
