import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Equal, Repository } from 'typeorm';
import { Educa } from '../entities/educa.entity';
import { Adolescente } from '../../adolescente/entities/adolescente.entity';
import { EducaPayloadDto } from '../dto/educa.payload.dto';
import { ResultWithData, SimpleResult } from 'src/common/dto/result.dto';
import { PaginatedResult } from 'src/common/dto/paginated.result.dto';
import { Estado } from 'src/common/enums/estado.enum';

@Injectable()
export class EducaService {
  constructor(
    @InjectRepository(Educa)
    private readonly educaRepository: Repository<Educa>,
    @InjectRepository(Adolescente)
    private readonly adolescenteRepository: Repository<Adolescente>,
  ) {}

  async createEduca(payload: EducaPayloadDto): Promise<ResultWithData<Educa>> {
    try {
      const adolescente = await this.adolescenteRepository.findOneBy({
        id: payload.adolescenteId,
      });

      if (!adolescente) {
        return new ResultWithData<Educa>(
          false,
          'No existe el adolescente con el id ingresado',
          null,
        );
      }

      const nuevaEduca = this.educaRepository.create({
        fecha: new Date(payload.fecha),
        estudia: payload.estudia,
        razonNoEstudia: payload.razonNoEstudia,
        nivel: payload.nivel,
        cicloAcademico: payload.cicloAcademico,
        carrera: payload.carrera,
        institucion: payload.institucion,
        modalidad: payload.modalidad,
        contacto: payload.contacto,
        observacion: payload.observacion,
        adolescente: adolescente,
      });

      const saved = await this.educaRepository.save(nuevaEduca);
      return new ResultWithData<Educa>(
        true,
        'Registro educativo creado exitosamente',
        saved,
      );
    } catch (error) {
      return new ResultWithData<Educa>(false, (error as Error).message, null);
    }
  }

  async getEducaPaginado(
    page: number = 1,
    size: number = 10,
    adolescenteId: number | undefined,
  ): Promise<PaginatedResult<Educa>> {
    const skip = (page - 1) * size;
    const where: Record<string, unknown> = { estado: Equal(Estado.ACTIVO) };
    if (adolescenteId != undefined) where.adolescente = { id: adolescenteId };
    const [data, total] = await this.educaRepository.findAndCount({
      where,
      take: size,
      skip,
      relations: ['adolescente'],
      order: { id: 'DESC' },
    });

    const totalPages = Math.ceil(total / size);
    return new PaginatedResult(data, totalPages, page, size);
  }

  async updateEduca(
    id: number,
    payload: EducaPayloadDto,
  ): Promise<ResultWithData<Educa>> {
    try {
      const educa = await this.educaRepository.findOneBy({ id });
      if (!educa) {
        return new ResultWithData<Educa>(
          false,
          'No existe el registro educativo',
          null,
        );
      }

      const adolescente = await this.adolescenteRepository.findOneBy({
        id: payload.adolescenteId,
      });

      if (!adolescente) {
        return new ResultWithData<Educa>(
          false,
          'Adolescente no encontrado',
          null,
        );
      }

      // Actualización de campos
      educa.fecha = new Date(payload.fecha);
      educa.estudia = payload.estudia;
      educa.razonNoEstudia = payload.razonNoEstudia;
      educa.nivel = payload.nivel;
      educa.cicloAcademico = payload.cicloAcademico;
      educa.carrera = payload.carrera;
      educa.institucion = payload.institucion;
      educa.modalidad = payload.modalidad;
      educa.contacto = payload.contacto;
      educa.observacion = payload.observacion;
      educa.adolescente = adolescente;

      const saved = await this.educaRepository.save(educa);
      return new ResultWithData<Educa>(
        true,
        'Registro actualizado correctamente',
        saved,
      );
    } catch (error) {
      return new ResultWithData<Educa>(false, (error as Error).message, null);
    }
  }

  async softDeleteEduca(id: number): Promise<SimpleResult> {
    try {
      const educa = await this.educaRepository.findOneBy({ id });
      if (!educa) {
        return new SimpleResult(false, 'Registro no encontrado');
      }
      educa.estado = Estado.INACTIVO;
      await this.educaRepository.save(educa);
      return new SimpleResult(
        true,
        'Registro educativo eliminado exitosamente',
      );
    } catch (error) {
      return new SimpleResult(false, (error as Error).message);
    }
  }
}
