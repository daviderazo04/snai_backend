import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';
import { Familia } from '../entities/familia.entity';
import { Adolescente } from '../../adolescente/entities/adolescente.entity';
import { Evento } from '../entities/evento.entity';
import { FamiliaDto } from '../dto/familia.dto'; // Asumo que este es el nombre de tu archivo DTO
import { ResultWithData } from 'src/common/dto/result.dto';
import { PaginatedResult } from 'src/common/dto/paginated.result.dto';

@Injectable()
export class FamiliaService {
  constructor(
    @InjectRepository(Familia)
    private readonly familiaRepository: Repository<Familia>,
    @InjectRepository(Adolescente)
    private readonly adolescenteRepository: Repository<Adolescente>,
    @InjectRepository(Evento)
    private readonly eventoRepository: Repository<Evento>,
  ) {}

  async create(familiaDto: FamiliaDto): Promise<ResultWithData<Familia>> {
    // 1. Validar existencia del Adolescente
    const adolescente = await this.adolescenteRepository.findOneBy({
      id: familiaDto.adolescenteId,
    });
    if (!adolescente) {
      throw new NotFoundException(
        `No se encontró el Adolescente con ID ${familiaDto.adolescenteId}`,
      );
    }

    // 2. Validar existencia del Evento
    const evento = await this.eventoRepository.findOneBy({
      id: familiaDto.eventoId,
    });
    if (!evento) {
      throw new NotFoundException(
        `No se encontró el Evento con ID ${familiaDto.eventoId}`,
      );
    }

    // 3. Separar IDs para mapeo manual
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { adolescenteId, eventoId, ...datosFamilia } = familiaDto;

    // 4. Crear entidad con relaciones
    const nuevaFamilia = this.familiaRepository.create({
      adolescente: adolescente,
      evento: evento,
      ...datosFamilia,
    });

    const familiaGuardada = await this.familiaRepository.save(nuevaFamilia);

    return new ResultWithData<Familia>(
      true,
      'Registro familiar creado exitosamente',
      familiaGuardada,
    );
  }

  async findAllPaginated(
    termino: string = '',
    page: number = 1,
    size: number = 10,
    adolescenteId?: number, // Filtro opcional
    eventoId?: number, // Filtro opcional
  ): Promise<PaginatedResult<Familia>> {
    const skip = (page - 1) * size;

    // Construcción dinámica del objeto where
    const where: any = {};

    // 1. Filtro por término (busca en el detalle de la interacción)
    if (termino) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      where.detalle = ILike(`%${termino}%`);
    }

    // 2. Filtro por Adolescente (Relación)
    if (adolescenteId) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      where.adolescente = { id: adolescenteId };
    }

    // 3. Filtro por Evento (Relación)
    if (eventoId) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      where.evento = { id: eventoId };
    }

    const [familias, total] = await this.familiaRepository.findAndCount({
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      where,
      relations: ['adolescente', 'evento'],
      order: { fecha: 'DESC' }, // Ordenamos por fecha más reciente
      take: size,
      skip: skip,
    });

    const totalPages = Math.ceil(total / size);
    return new PaginatedResult(familias, totalPages, page, size);
  }

  async findOne(id: number): Promise<ResultWithData<Familia>> {
    const familia = await this.familiaRepository.findOne({
      where: { id },
      relations: ['adolescente', 'evento'],
    });

    if (!familia) {
      throw new NotFoundException(
        `El registro familiar con ID ${id} no fue encontrado`,
      );
    }

    return new ResultWithData<Familia>(
      true,
      'Registro familiar recuperado exitosamente',
      familia,
    );
  }

  async update(
    id: number,
    updateFamiliaDto: Partial<FamiliaDto>,
  ): Promise<ResultWithData<Familia>> {
    // 1. Buscar registro existente
    const familia = await this.familiaRepository.findOneBy({ id });
    if (!familia) {
      throw new NotFoundException(
        `El registro familiar con ID ${id} no fue encontrado`,
      );
    }

    // 2. Validar y actualizar relaciones si vienen en el DTO
    if (updateFamiliaDto.adolescenteId) {
      const adolescente = await this.adolescenteRepository.findOneBy({
        id: updateFamiliaDto.adolescenteId,
      });
      if (!adolescente) {
        throw new NotFoundException(
          `No se encontró el Adolescente con ID ${updateFamiliaDto.adolescenteId}`,
        );
      }
      familia.adolescente = adolescente;
    }

    if (updateFamiliaDto.eventoId) {
      const evento = await this.eventoRepository.findOneBy({
        id: updateFamiliaDto.eventoId,
      });
      if (!evento) {
        throw new NotFoundException(
          `No se encontró el Evento con ID ${updateFamiliaDto.eventoId}`,
        );
      }
      familia.evento = evento;
    }

    // 3. Separar IDs y actualizar datos simples
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { adolescenteId, eventoId, ...datosAActualizar } = updateFamiliaDto;

    this.familiaRepository.merge(familia, datosAActualizar);

    // 4. Guardar cambios
    const familiaActualizada = await this.familiaRepository.save(familia);

    return new ResultWithData<Familia>(
      true,
      'Registro familiar actualizado exitosamente',
      familiaActualizada,
    );
  }

  async remove(id: number): Promise<ResultWithData<boolean>> {
    const familia = await this.familiaRepository.findOneBy({ id });
    if (!familia) {
      throw new NotFoundException(
        `El registro familiar con ID ${id} no fue encontrado`,
      );
    }

    await this.familiaRepository.remove(familia);

    return new ResultWithData<boolean>(
      true,
      'Registro familiar eliminado exitosamente',
      true,
    );
  }
}
