import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Equal, ILike, Repository } from 'typeorm';
import { Gdos } from '../entities/gdos';
import { ParamPayload } from '../dto/param.payload';
import { ResultWithData, SimpleResult } from '../../common/dto/result.dto';
import { PaginatedResult } from '../../common/dto/paginated.result.dto';
import { Estado } from '../../common/enums/estado.enum';

@Injectable()
export class GdosService {
  constructor(
    @InjectRepository(Gdos)
    private gdosRepository: Repository<Gdos>,
  ) {}
  async getPaginatedGdos(
    nombre: string = '',
    page: number = 1,
    size: number = 10,
  ): Promise<PaginatedResult<Gdos>> {
    if (nombre == '') {
      const [gdos, totales] = await this.gdosRepository.findAndCount({
        take: size,
        skip: (page - 1) * size,
        where: { estado: Equal(Estado.ACTIVO) },
      });
      const totalPages = Math.ceil(totales / size);
      return new PaginatedResult(gdos, totalPages, page, size);
    } else {
      const [gdos, totales] = await this.gdosRepository.findAndCount({
        where: { nombre: ILike(`%${nombre}%`), estado: Equal(Estado.ACTIVO) },
        take: size,
        skip: (page - 1) * size,
      });
      const totalPages = Math.ceil(totales / size);
      return new PaginatedResult(gdos, totalPages, page, size);
    }
  }
  async createGdos(payload: ParamPayload): Promise<ResultWithData<Gdos>> {
    const gdo = this.gdosRepository.create({
      nombre: payload.nombre,
    });
    const savedGdos = await this.gdosRepository.save(gdo);
    return new ResultWithData<Gdos>(
      true,
      'Gdos creado exitosamente',
      savedGdos,
    );
  }
  async softDeleteGdos(id: number): Promise<SimpleResult> {
    try {
      const gdos = await this.gdosRepository.findOne({
        where: { id: id },
        relations: ['adolescentes'],
      });
      if (!gdos) throw new Error('No existe el gdos con el id ingresado');
      const hasActiveAdolescentes = gdos.adolescentes?.some(
        (adolescente) => adolescente.estado === Estado.ACTIVO,
      );
      if (hasActiveAdolescentes) {
        throw new Error(
          'No se puede eliminar el gdos porque tiene adolescentes asociados',
        );
      }
      gdos.estado = Estado.INACTIVO;
      await this.gdosRepository.save(gdos);
      return new SimpleResult(true, 'Gdos eliminado exitosamente');
    } catch (e) {
      const err = e as Error;
      return new SimpleResult(false, err.message);
    }
  }
  async editGdos(
    id: number,
    payload: ParamPayload,
  ): Promise<ResultWithData<Gdos>> {
    try {
      const gdos = await this.gdosRepository.findOneBy({ id: id });
      if (!gdos) throw new Error('No existe el gdos con el id ingresado');
      gdos.nombre = payload.nombre;
      const savedGdos = await this.gdosRepository.save(gdos);
      return new ResultWithData<Gdos>(
        true,
        'Gdos editado exitosamente',
        savedGdos,
      );
    } catch (e) {
      const err = e as Error;
      return new ResultWithData<Gdos>(false, err.message, null);
    }
  }
}
