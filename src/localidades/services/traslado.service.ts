import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Traslado } from '../entities/traslado.entity';
import { Equal, MoreThanOrEqual, Repository } from 'typeorm';
import {
  TrasladoCreatePayload,
  TrasladoUpdatePayload,
} from '../dto/traslado.payload';
import { Cai } from '../entities/cai.entity';
import { Adolescente } from '../../adolescente/entities/adolescente.entity';
import { Estado } from '../../common/enums/estado.enum';
import { ResultWithData } from '../../common/dto/result.dto';
import { PaginatedResult } from '../../common/dto/paginated.result.dto';

@Injectable()
export class TrasladoService {
  constructor(
    @InjectRepository(Traslado)
    private trasladoRepository: Repository<Traslado>,
    @InjectRepository(Cai)
    private caiRepository: Repository<Cai>,
    @InjectRepository(Adolescente)
    private adolescenteRepository: Repository<Adolescente>,
  ) {}
  async createTraslado(
    payload: TrasladoCreatePayload,
  ): Promise<ResultWithData<Traslado>> {
    const adolescente = await this.adolescenteRepository.findOne({
      where: {
        id: payload.adolescenteId,
      },
      relations: ['cai'],
    });
    if (!adolescente) {
      return new ResultWithData<Traslado>(false, 'Adolescente no existe', null);
    }
    if (adolescente.estado == Estado.INACTIVO) {
      return new ResultWithData<Traslado>(false, 'Adolescente inactivo', null);
    }
    const cai = await this.caiRepository.findOneBy({ id: payload.caiId });
    if (cai!.estado == Estado.INACTIVO) {
      return new ResultWithData<Traslado>(false, 'Cai inactivo', null);
    }
    const traslado = new Traslado();
    traslado.fecha = payload.fecha;
    traslado.observaciones = payload.observaciones;
    traslado.adolecente = adolescente!;
    traslado.cai = cai!;
    traslado.fromCai = adolescente.cai;
    await this.trasladoRepository.save(traslado);
    adolescente.cai = cai!;
    await this.adolescenteRepository.save(adolescente);
    return new ResultWithData<Traslado>(
      true,
      'Traslado creado exitosamente',
      traslado,
    );
  }
  async updateTraslado(
    payload: TrasladoUpdatePayload,
    id: number,
  ): Promise<ResultWithData<Traslado>> {
    const traslado = await this.trasladoRepository.findOne({
      where: { id: id },
      relations: ['cai', 'adelecente'],
    });
    const adolecente = traslado!.adolecente;
    if (traslado == null) {
      return new ResultWithData<Traslado>(false, 'Cai no encontrado', null);
    }
    if (payload.caiId != null) {
      const cai = await this.caiRepository.findOneBy({ id: payload.caiId });
      if (cai == null) {
        return new ResultWithData<Traslado>(false, 'Cai no encontrado', null);
      }
      if (cai.estado == Estado.INACTIVO) {
        return new ResultWithData<Traslado>(false, 'Cai inactivo', null);
      }
      traslado.cai = cai!;
      adolecente.cai = cai!;
    }
    if (payload.fecha != null) {
      traslado.fecha = payload.fecha;
    }
    if (payload.observaciones != null) {
      traslado.observaciones = payload.observaciones;
    }
    await this.trasladoRepository.save(traslado);
    await this.adolescenteRepository.save(adolecente);
    return new ResultWithData<Traslado>(
      true,
      'Traslado actualizado exitosamente',
      traslado,
    );
  }
  async getPagiantedTraslados(
    from: Date | null,
    to: Date | null,
    page: number = 1,
    size: number = 10,
  ): Promise<PaginatedResult<Traslado>> {
    const skip = (page - 1) * size;
    const where: Record<string, unknown> = { estado: Equal(Estado.ACTIVO) };
    if (from) where.fecha = MoreThanOrEqual(from);
    if (to) where.fecha = MoreThanOrEqual(to);
    const [traslados, total] = await this.trasladoRepository.findAndCount({
      where,
      take: size,
      skip,
      relations: ['adolecente', 'cai', 'fromCai'],
    });
    const totalPages = Math.ceil(total / size);
    return new PaginatedResult(traslados, totalPages, page, size);
  }
  async softDeleteTraslado(id: number): Promise<ResultWithData<Traslado>> {
    const traslado = await this.trasladoRepository.findOne({
      where: { id: id },
      relations: ['cai', 'adelecente'],
    });
    const adolecente = traslado!.adolecente;
    if (traslado == null) {
      return new ResultWithData<Traslado>(false, 'Cai no encontrado', null);
    }
    traslado.estado = Estado.INACTIVO;
    //revertimos
    adolecente.cai = traslado.fromCai;
    await this.trasladoRepository.save(traslado);
    await this.adolescenteRepository.save(adolecente);
    return new ResultWithData<Traslado>(
      true,
      'Traslado eliminado exitosamente',
      traslado,
    );
  }
}
