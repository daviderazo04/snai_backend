import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Gdos } from '../entities/gdos';
import { ParamPayload } from '../dto/param.payload';
import { ResultWithData } from '../../common/dto/result.dto';
import { PaginatedResult } from '../../common/dto/paginated.result.dto';

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
      });
      const totalPages = Math.ceil(totales / size);
      return new PaginatedResult(gdos, totalPages, page, size);
    } else {
      const [gdos, totales] = await this.gdosRepository.findAndCount({
        where: { nombre: nombre },
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
}
