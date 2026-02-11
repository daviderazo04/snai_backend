import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Equal, ILike, Repository } from 'typeorm';
import { Nacionalidad } from '../entities/nacionalidad.entity';
import { ParamPayload } from '../dto/param.payload';
import { ResultWithData, SimpleResult } from '../../common/dto/result.dto';
import { PaginatedResult } from '../../common/dto/paginated.result.dto';
import { Estado } from '../../common/enums/estado.enum';

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
          where: { estado: Equal(Estado.ACTIVO) },
        });
      const totalPages = Math.ceil(totales / size);
      return new PaginatedResult(nacionalidades, totalPages, page, size);
    } else {
      const [nacionalidades, totales] =
        await this.nacionalidadRepository.findAndCount({
          where: { nombre: ILike(`%${nombre}%`), estado: Equal(Estado.ACTIVO) },
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
  async softDeleteNacionalidad(id: number): Promise<SimpleResult> {
    try {
      const nacionalidad = await this.nacionalidadRepository.findOne({
        where: {
          id: id,
        },
        relations: ['adolescentes', 'representantes'],
      });
      if (!nacionalidad)
        throw new Error('No existe la nacionalidad con el id ingresado');
      const hasActiveAdolescentes = nacionalidad.adolescentes?.some(
        (adolescente) => adolescente.estado === Estado.ACTIVO,
      );
      const hasRepresentantes = (nacionalidad.representantes ?? []).length > 0;
      if (hasActiveAdolescentes || hasRepresentantes) {
        throw new Error(
          'No se puede eliminar la nacionalidad porque tiene registros asociados',
        );
      }
      nacionalidad.estado = Estado.INACTIVO;
      await this.nacionalidadRepository.save(nacionalidad);
      return new SimpleResult(true, 'Nacionalidad eliminada exitosamente');
    } catch (e) {
      const err = e as Error;
      return new SimpleResult(false, err.message);
    }
  }
  async editNacionalidad(
    id: number,
    payload: ParamPayload,
  ): Promise<ResultWithData<Nacionalidad>> {
    try {
      const nacionalidad = await this.nacionalidadRepository.findOneBy({
        id: id,
      });
      if (!nacionalidad)
        throw new Error('No existe la nacionalidad con el id ingresado');
      nacionalidad.nombre = payload.nombre;
      const savedNacionalidad =
        await this.nacionalidadRepository.save(nacionalidad);
      return new ResultWithData<Nacionalidad>(
        true,
        'Nacionalidad editada exitosamente',
        savedNacionalidad,
      );
    } catch (e) {
      const err = e as Error;
      return new ResultWithData<Nacionalidad>(false, err.message, null);
    }
  }
}
