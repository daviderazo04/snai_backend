import { Injectable } from '@nestjs/common';
import { ILike, Repository } from 'typeorm';
import { Provincia } from '../entities/provincia.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { ProvinciaPayloadDto } from '../dto/provincia.payload.dto';
import { ResultWithData } from '../../common/dto/result.dto';
import { PaginatedResult } from '../../common/dto/paginated.result.dto';
import { AuditoriaService } from '../../auditoria/auditoria.service';
import { AuditedRequest } from '../../common/request/AuditedRequest';
import { ProvinciaUpdatePayloadDto } from '../dto/provincia.update.payload.dto';

@Injectable()
export class ProvinciaService {
  constructor(
    @InjectRepository(Provincia)
    private readonly provinciaRepository: Repository<Provincia>,
    private readonly auditoriaService: AuditoriaService,
  ) {}
  async updateProvincia(
    id: number,
    payload: ProvinciaUpdatePayloadDto,
  ): Promise<ResultWithData<Provincia>> {
    const provincia = await this.provinciaRepository.findOneBy({ id: id });
    if (!provincia) {
      return new ResultWithData<Provincia>(
        false,
        'Provincia no encontrada',
        null,
      );
    }
    provincia.nombre = payload.nombre;
    await this.provinciaRepository.save(provincia);
    return new ResultWithData<Provincia>(
      true,
      'Provincia actualizada',
      provincia,
    );
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
