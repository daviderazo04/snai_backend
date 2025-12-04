import { Injectable } from '@nestjs/common';
import { ILike, Repository } from 'typeorm';
import { Canton } from '../entities/canton.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Provincia } from '../entities/provincia.entity';
import { CantonPayload } from '../dto/canton.payload.dto';
import { ResultWithData } from '../../common/dto/result.dto';
import { PaginatedResult } from '../../common/dto/paginated.result.dto';

@Injectable()
export class CantonService {
  constructor(
    @InjectRepository(Canton)
    private readonly cantonRepository: Repository<Canton>,
    @InjectRepository(Provincia)
    private readonly provinciaRepository: Repository<Provincia>,
  ) {}

  async createCanton(payload: CantonPayload): Promise<ResultWithData<Canton>> {
    try {
      const provincia = await this.provinciaRepository.findOneBy({
        id: payload.provinciaId,
      });
      if (!provincia) {
        throw new Error('Provincia no encontrada');
      }
      const newCanton = this.cantonRepository.create({
        nombre: payload.nombre,
        provincia: provincia,
      });
      await this.cantonRepository.save(newCanton);
      return new ResultWithData<Canton>(true, 'Canton creado', newCanton);
    } catch (e) {
      const err = e as Error;
      return new ResultWithData<Canton>(false, err.message, null);
    }
  }

  async getPaginatedCanton(
    nombre: string = '',
    page: number = 1,
    size: number = 10,
  ): Promise<PaginatedResult<Canton>> {
    const skip = (page - 1) * size;
    if (nombre == '') {
      const [perfiles, totales] = await this.cantonRepository.findAndCount({
        take: size,
        skip: skip,
        relations: ['provincia'],
      });
      const totalPages = Math.ceil(totales / size);
      return new PaginatedResult(perfiles, totalPages, page, size);
    } else {
      const [perfiles, totales] = await this.cantonRepository.findAndCount({
        where: { nombre: ILike(`%${nombre}%`) },
        take: size,
        skip: skip,
        relations: ['provincia'],
      });
      const totalPages = Math.ceil(totales / size);
      return new PaginatedResult(perfiles, totalPages, page, size);
    }
  }
}
