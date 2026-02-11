import { Injectable } from '@nestjs/common';
import { Equal, ILike, Repository } from 'typeorm';
import { Canton } from '../entities/canton.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Provincia } from '../entities/provincia.entity';
import { CantonPayload } from '../dto/canton.payload.dto';
import { ResultWithData, SimpleResult } from '../../common/dto/result.dto';
import { PaginatedResult } from '../../common/dto/paginated.result.dto';
import { Estado } from '../../common/enums/estado.enum';
import { PutLocalidadesDto } from '../dto/put.localidades.dto';

@Injectable()
export class CantonService {
  constructor(
    @InjectRepository(Canton)
    private readonly cantonRepository: Repository<Canton>,
    @InjectRepository(Provincia)
    private readonly provinciaRepository: Repository<Provincia>,
  ) {}

  async softDeleteCaton(id: number): Promise<SimpleResult> {
    try {
      const canton = await this.cantonRepository.findOne({
        where: { id: id },
        relations: ['cais', 'adolescentes', 'representantes'],
      });
      if (!canton) throw new Error('Canton no encontrado');
      const hasActiveCais = canton.cais?.some(
        (cai) => cai.estado === Estado.ACTIVO,
      );
      const hasActiveAdolescentes = canton.adolescentes?.some(
        (adolescente) => adolescente.estado === Estado.ACTIVO,
      );
      const hasRepresentantes = (canton.representantes ?? []).length > 0;
      if (hasActiveCais || hasActiveAdolescentes || hasRepresentantes) {
        throw new Error(
          'No se puede eliminar el canton porque tiene registros asociados',
        );
      }
      canton.estado = Estado.INACTIVO;
      await this.cantonRepository.save(canton);
      return new SimpleResult(true, 'Canton eliminado');
    } catch (e) {
      const err = e as Error;
      return new SimpleResult(false, err.message);
    }
  }
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
  async editCanton(
    id: number,
    payload: PutLocalidadesDto,
  ): Promise<ResultWithData<Canton>> {
    try {
      const canton = await this.cantonRepository.findOne({
        where: { id: id },
        relations: ['provincia'],
      });
      if (!canton) throw new Error('Provincia no encontrada');
      canton.nombre = payload.nombre;
      const savedCanton = await this.cantonRepository.save(canton);
      return new ResultWithData<Canton>(
        true,
        'Provincia actualizada',
        savedCanton,
      );
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
        where: { estado: Equal(Estado.ACTIVO) },
      });
      const totalPages = Math.ceil(totales / size);
      return new PaginatedResult(perfiles, totalPages, page, size);
    } else {
      const [perfiles, totales] = await this.cantonRepository.findAndCount({
        where: { nombre: ILike(`%${nombre}%`), estado: Equal(Estado.ACTIVO) },
        take: size,
        skip: skip,
        relations: ['provincia'],
      });
      const totalPages = Math.ceil(totales / size);
      return new PaginatedResult(perfiles, totalPages, page, size);
    }
  }
}
