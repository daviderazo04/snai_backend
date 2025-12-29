import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Equal, ILike, Like, Repository } from 'typeorm';
import { EstadoCivil } from '../entities/estadoCivil';
import { ParamPayload } from '../dto/param.payload';
import { ResultWithData, SimpleResult } from '../../common/dto/result.dto';
import { PaginatedResult } from '../../common/dto/paginated.result.dto';
import { Estado } from '../../common/enums/estado.enum';

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
          where: { estado: Equal(Estado.ACTIVO) },
        });
      const totalPages = Math.ceil(totales / size);
      return new PaginatedResult(estadoCivils, totalPages, page, size);
    } else {
      const [estadoCivils, totales] =
        await this.estadoCivilRepository.findAndCount({
          where: {
            nombre: Like(`%${nombre}%`),
            estado: Equal(Estado.ACTIVO),
          },
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
  async editEstadoCivil(
    id: number,
    payload: ParamPayload,
  ): Promise<ResultWithData<EstadoCivil>> {
    try {
      const estadoCivil = await this.estadoCivilRepository.findOneBy({
        id: id,
      });
      if (!estadoCivil)
        throw new Error('No existe el estado civil con el id ingresado');
      estadoCivil.nombre = payload.nombre;
      const savedEstadoCivil =
        await this.estadoCivilRepository.save(estadoCivil);
      return new ResultWithData<EstadoCivil>(
        true,
        'Estado civil editado exitosamente',
        savedEstadoCivil,
      );
    } catch (e) {
      const err = e as Error;
      return new ResultWithData<EstadoCivil>(false, err.message, null);
    }
  }
  async softDeleteEstadoCivil(id: number): Promise<SimpleResult> {
    try {
      const estadoCivil = await this.estadoCivilRepository.findOneBy({
        id: id,
      });
      if (!estadoCivil)
        throw new Error('No existe el estado civil con el id ingresado');
      estadoCivil.estado = Estado.INACTIVO;
      await this.estadoCivilRepository.save(estadoCivil);
      return new SimpleResult(true, 'Estado civil eliminado exitosamente');
    } catch (e) {
      const err = e as Error;
      return new SimpleResult(false, err.message);
    }
  }
}
