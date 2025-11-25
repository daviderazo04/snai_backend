import { Injectable } from '@nestjs/common';
import { ILike, Repository } from 'typeorm';
import { Canton } from './entities/canton.entity';
import { Provincia } from './entities/provincia.entity';
import { ProvinciaPayloadDto } from './dto/provincia.payload.dto';
import { ResultWithData } from '../common/dto/result.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { CantonPayload } from './dto/canton.payload.dto';
import { PaginatedResult } from '../common/dto/paginated.result.dto';

@Injectable()
export class LocalidadService {
  constructor(
    @InjectRepository(Canton)
    private cantonRepository: Repository<Canton>,
    @InjectRepository(Provincia)
    private provinciaRepository: Repository<Provincia>,
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
  async createProvincia(
    payload: ProvinciaPayloadDto,
  ): Promise<ResultWithData<Provincia>> {
    try {
      const newProvincia = this.provinciaRepository.create({
        nombre: payload.nombre,
      });
      const savedProvincia = await this.provinciaRepository.save(newProvincia);
      return new ResultWithData<Provincia>(
        true,
        'Provincia creada',
        savedProvincia,
      );
    } catch {
      return new ResultWithData<Provincia>(
        false,
        'Error al crear provincia',
        null,
      );
    }
  }

  async getPaginatedProvincia(
    nombre: string = '',
    page: number = 1,
    size: number = 10,
  ): Promise<PaginatedResult<Provincia>> {
    const skip = (page - 1) * size;
    if (nombre == '') {
      const [perfiles, totales] = await this.provinciaRepository.findAndCount({
        take: size,
        skip: skip,
        relations: { cantones: true },
      });
      const totalPages = Math.ceil(totales / size);
      return new PaginatedResult(perfiles, totalPages, page, size);
    } else {
      const [perfiles, totales] = await this.provinciaRepository.findAndCount({
        where: { nombre: ILike(`%${nombre}%`) },
        take: size,
        skip: skip,
        relations: { cantones: true },
      });
      return new PaginatedResult(perfiles, totales, page, size);
    }
  }
}
