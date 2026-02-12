import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Equal, MoreThanOrEqual, Repository } from 'typeorm';
import { Salud } from '../entities/salud.entity';
import { Adolescente } from '../../adolescente/entities/adolescente.entity';
import { SaludPayloadDto } from '../dto/salud.payload.dto';
import { ResultWithData, SimpleResult } from 'src/common/dto/result.dto';
import { PaginatedResult } from 'src/common/dto/paginated.result.dto';
import { Estado } from 'src/common/enums/estado.enum';

@Injectable()
export class SaludService {
  constructor(
    @InjectRepository(Salud)
    private readonly saludRepository: Repository<Salud>,
    @InjectRepository(Adolescente)
    private readonly adolescenteRepository: Repository<Adolescente>,
  ) {}

  async createSalud(payload: SaludPayloadDto): Promise<ResultWithData<Salud>> {
    try {
      const adolescente = await this.adolescenteRepository.findOneBy({
        id: payload.adolescenteId,
      });

      if (!adolescente) {
        return new ResultWithData<Salud>(
          false,
          'No existe el adolescente con el id ingresado',
          null,
        );
      }

      const nuevaSalud = this.saludRepository.create({
        fecha: new Date(payload.fecha),
        diagnostico: payload.diagnostico,
        tomaMedicacion: payload.tomaMedicacion,
        consumeSustancia: payload.consumeSustancia,
        tipoSustancia: payload.tipoSustancia,
        numAtenMedica: payload.numAtenMedica,
        discapacidad: payload.discapacidad,
        observacion: payload.observacion,
        adolescente: adolescente,
      });

      const saved = await this.saludRepository.save(nuevaSalud);
      return new ResultWithData<Salud>(
        true,
        'Registro de salud creado exitosamente',
        saved,
      );
    } catch (error) {
      return new ResultWithData<Salud>(false, (error as Error).message, null);
    }
  }

  async getSaludPaginado(
    page: number = 1,
    size: number = 10,
    adolescenteId: number | undefined,
  ): Promise<PaginatedResult<Salud>> {
    const skip = (page - 1) * size;
    const where: Record<string, unknown> = { estado: Equal(Estado.ACTIVO) };
    if (adolescenteId != undefined) where.adolescente = { id: adolescenteId };
    const [data, total] = await this.saludRepository.findAndCount({
      where,
      take: size,
      skip,
      relations: ['adolescente'],
      order: { id: 'DESC' },
    });

    const totalPages = Math.ceil(total / size);
    return new PaginatedResult(data, totalPages, page, size);
  }

  async updateSalud(
    id: number,
    payload: SaludPayloadDto,
  ): Promise<ResultWithData<Salud>> {
    try {
      const salud = await this.saludRepository.findOneBy({ id });
      if (!salud) {
        return new ResultWithData<Salud>(
          false,
          'No existe el registro de salud',
          null,
        );
      }

      const adolescente = await this.adolescenteRepository.findOneBy({
        id: payload.adolescenteId,
      });

      if (!adolescente) {
        return new ResultWithData<Salud>(
          false,
          'Adolescente no encontrado',
          null,
        );
      }

      // Actualización de campos
      salud.fecha = new Date(payload.fecha);
      salud.diagnostico = payload.diagnostico;
      salud.tomaMedicacion = payload.tomaMedicacion;
      salud.consumeSustancia = payload.consumeSustancia;
      salud.tipoSustancia = payload.tipoSustancia;
      salud.numAtenMedica = payload.numAtenMedica;
      salud.discapacidad = payload.discapacidad;
      salud.observacion = payload.observacion;
      salud.adolescente = adolescente;

      const saved = await this.saludRepository.save(salud);
      return new ResultWithData<Salud>(true, 'Registro actualizado', saved);
    } catch (error) {
      return new ResultWithData<Salud>(false, (error as Error).message, null);
    }
  }

  async softDeleteSalud(id: number): Promise<SimpleResult> {
    try {
      const salud = await this.saludRepository.findOneBy({ id });
      if (!salud) {
        return new SimpleResult(false, 'Registro no encontrado');
      }
      salud.estado = Estado.INACTIVO;
      await this.saludRepository.save(salud);
      return new SimpleResult(true, 'Registro eliminado exitosamente (lógico)');
    } catch (error) {
      return new SimpleResult(false, (error as Error).message);
    }
  }
}
