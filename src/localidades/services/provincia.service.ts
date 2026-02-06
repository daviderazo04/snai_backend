import { Injectable } from '@nestjs/common';
import { Equal, ILike, Repository } from 'typeorm';
import { Provincia } from '../entities/provincia.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { ProvinciaPayloadDto } from '../dto/provincia.payload.dto';
import { ResultWithData, SimpleResult } from '../../common/dto/result.dto';
import { PaginatedResult } from '../../common/dto/paginated.result.dto';
import { AuditoriaService } from '../../auditoria/auditoria.service';
import { ProvinciaUpdatePayloadDto } from '../dto/provincia.update.payload.dto';
import { Estado } from '../../common/enums/estado.enum';
import { PutLocalidadesDto } from '../dto/put.localidades.dto';

@Injectable()
export class ProvinciaService {
  constructor(
    @InjectRepository(Provincia)
    private readonly provinciaRepository: Repository<Provincia>,
    private readonly auditoriaService: AuditoriaService,
  ) {}

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
  async editProvincia(
    id: number,
    payload: PutLocalidadesDto,
  ): Promise<ResultWithData<Provincia>> {
    try {
      const provincia = await this.provinciaRepository.findOneBy({ id: id });
      if (!provincia) throw new Error('Provincia no encontrada');
      provincia.nombre = payload.nombre;
      const savedProvincia = await this.provinciaRepository.save(provincia);
      return new ResultWithData<Provincia>(
        true,
        'Provincia actualizada',
        savedProvincia,
      );
    } catch (e) {
      const err = e as Error;
      return new ResultWithData<Provincia>(false, err.message, null);
    }
  }
  async softDeleteProvincia(id: number): Promise<SimpleResult> {
    try {
      const provincia = await this.provinciaRepository.findOne({
        where: { id: id },
        relations: ['cantones'],
      });
      if (!provincia) throw new Error('Provincia no encontrada');
      const hasActiveCantones = provincia.cantones?.some(
        (canton) => canton.estado === Estado.ACTIVO,
      );
      if (hasActiveCantones) {
        throw new Error(
          'No se puede eliminar la provincia porque tiene cantones asociados',
        );
      }
      provincia.estado = Estado.INACTIVO;
      await this.provinciaRepository.save(provincia);
      return new SimpleResult(true, 'Provincia eliminada');
    } catch (e) {
      const err = e as Error;
      return new SimpleResult(true, err.message);
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
        where: { estado: Equal(Estado.ACTIVO) },
        relations: { cantones: true },
      });
      const totalPages = Math.ceil(totales / size);
      return new PaginatedResult(perfiles, totalPages, page, size);
    } else {
      const [perfiles, totales] = await this.provinciaRepository.findAndCount({
        where: { nombre: ILike(`%${nombre}%`), estado: Equal(Estado.ACTIVO) },
        take: size,
        skip: skip,
        relations: { cantones: true },
      });
      return new PaginatedResult(perfiles, totales, page, size);
    }
  }
}
