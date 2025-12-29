import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Equal, Repository } from 'typeorm';
import { Etnia } from '../entities/etnia.entity';
import { ParamPayload } from '../dto/param.payload';
import { ResultWithData, SimpleResult } from '../../common/dto/result.dto';
import { PaginatedResult } from '../../common/dto/paginated.result.dto';
import { Estado } from '../../common/enums/estado.enum';

@Injectable()
export class EtniaService {
  constructor(
    @InjectRepository(Etnia)
    private etniaRepository: Repository<Etnia>,
  ) {}
  async getPaginatedEtnia(
    nombre: string = '',
    page: number = 1,
    size: number = 10,
  ): Promise<PaginatedResult<Etnia>> {
    if (nombre == '') {
      const [etnias, totales] = await this.etniaRepository.findAndCount({
        take: size,
        skip: (page - 1) * size,
        where: { estado: Equal(Estado.ACTIVO) },
      });
      const totalPages = Math.ceil(totales / size);
      return new PaginatedResult(etnias, totalPages, page, size);
    } else {
      const [etnias, totales] = await this.etniaRepository.findAndCount({
        where: { nombre: nombre, estado: Equal(Estado.ACTIVO) },
        take: size,
        skip: (page - 1) * size,
      });
      const totalPages = Math.ceil(totales / size);
      return new PaginatedResult(etnias, totalPages, page, size);
    }
  }
  async createEtnia(payload: ParamPayload): Promise<ResultWithData<Etnia>> {
    const etnia = this.etniaRepository.create({
      nombre: payload.nombre,
    });
    const savedEtnia = await this.etniaRepository.save(etnia);
    return new ResultWithData<Etnia>(
      true,
      'Etnia creada exitosamente',
      savedEtnia,
    );
  }
  async softDeleteEtnia(id: number): Promise<SimpleResult> {
    try {
      const etnia = await this.etniaRepository.findOneBy({ id: id });
      if (!etnia) throw new Error('No existe la etnia con el id ingresado');
      etnia.estado = Estado.INACTIVO;
      await this.etniaRepository.save(etnia);
      return new SimpleResult(true, 'Etnia eliminada exitosamente');
    } catch (e) {
      const err = e as Error;
      return new SimpleResult(false, err.message);
    }
  }
  async editEtnia(
    id: number,
    payload: ParamPayload,
  ): Promise<ResultWithData<Etnia>> {
    try {
      const etnia = await this.etniaRepository.findOneBy({ id: id });
      if (!etnia) throw new Error('No existe la etnia con el id ingresado');
      etnia.nombre = payload.nombre;
      const savedEtnia = await this.etniaRepository.save(etnia);
      return new ResultWithData<Etnia>(
        true,
        'Etnia editada exitosamente',
        savedEtnia,
      );
    } catch (e) {
      const err = e as Error;
      return new ResultWithData<Etnia>(false, err.message, null);
    }
  }
}
