import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';
import { Ocupacion } from '../entities/ocupacion.entity'; // Asegúrate de que la entidad se llame así
import { Adolescente } from '../../adolescente/entities/adolescente.entity';
import { CreateOcupacionDto } from '../dto/ocupacion.dto';
import { ResultWithData } from 'src/common/dto/result.dto';
import { PaginatedResult } from 'src/common/dto/paginated.result.dto';

@Injectable()
export class OcupacionService {
  constructor(
    @InjectRepository(Ocupacion)
    private readonly ocupacionRepository: Repository<Ocupacion>,
    @InjectRepository(Adolescente)
    private readonly adolescenteRepository: Repository<Adolescente>,
  ) {}

  async create(
    createOcupacionDto: CreateOcupacionDto,
  ): Promise<ResultWithData<Ocupacion>> {
    const adolescente = await this.adolescenteRepository.findOneBy({
      id: createOcupacionDto.adolescenteId,
    });
    if (!adolescente) {
      return new ResultWithData<Ocupacion>(
        false,
        `No se encontró el Adolescente con ID ${createOcupacionDto.adolescenteId}`,
        null,
      );
    }

    // 2. Separar el ID del resto de datos
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { adolescenteId, ...datosOcupacion } = createOcupacionDto;

    // 3. Crear la entidad
    const nuevaOcupacion = this.ocupacionRepository.create({
      adolescente: adolescente,
      ...datosOcupacion,
    });

    const ocupacionGuardada =
      await this.ocupacionRepository.save(nuevaOcupacion);

    return new ResultWithData<Ocupacion>(
      false,
      'Registro de ocupación creado exitosamente',
      ocupacionGuardada,
    );
  }

  async findAllPaginated(
    termino: string = '',
    page: number = 1,
    size: number = 10,
    adolescenteId?: number, // Filtro opcional
  ): Promise<PaginatedResult<Ocupacion>> {
    const skip = (page - 1) * size;

    // Construcción dinámica del objeto where
    const where: any = {};

    // 1. Filtro por término (Nombre del Taller)
    if (termino) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      where.taller = ILike(`%${termino}%`);
    }

    // 2. Filtro por Adolescente (Relación)
    if (adolescenteId) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      where.adolescente = { id: adolescenteId };
    }

    const [ocupaciones, total] = await this.ocupacionRepository.findAndCount({
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      where,
      relations: ['adolescente'],
      order: { fecha: 'DESC' }, // Ordenar por fecha de la más actual a la más antigua
      take: size,
      skip: skip,
    });

    const totalPages = Math.ceil(total / size);
    return new PaginatedResult(ocupaciones, totalPages, page, size);
  }

  async findOne(id: number): Promise<ResultWithData<Ocupacion>> {
    const ocupacion = await this.ocupacionRepository.findOne({
      where: { id },
      relations: ['adolescente'],
    });

    if (!ocupacion) {
      return new ResultWithData<Ocupacion>(
        false,
        `El registro de ocupación con ID ${id} no fue encontrado`,
        null,
      );
    }

    return new ResultWithData<Ocupacion>(
      true,
      'Registro de ocupación recuperado exitosamente',
      ocupacion,
    );
  }

  async update(
    id: number,
    updateOcupacionDto: CreateOcupacionDto,
  ): Promise<ResultWithData<Ocupacion>> {
    // 1. Buscar el registro existente
    const ocupacion = await this.ocupacionRepository.findOneBy({ id });
    if (!ocupacion) {
      return new ResultWithData<Ocupacion>(
        false,
        `El registro de ocupación con ID ${id} no fue encontrado`,
        null,
      );
    }

    // 2. Si viene ID de adolescente, validar y actualizar relación
    if (updateOcupacionDto.adolescenteId) {
      const adolescente = await this.adolescenteRepository.findOneBy({
        id: updateOcupacionDto.adolescenteId,
      });
      if (!adolescente) {
        return new ResultWithData<Ocupacion>(
          false,
          `No se encontró el Adolescente con ID ${updateOcupacionDto.adolescenteId}`,
          null,
        );
      }
      ocupacion.adolescente = adolescente;
    }

    // 3. Separar ID para no sobrescribir y actualizar campos simples
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { adolescenteId, ...datosAActualizar } = updateOcupacionDto;

    this.ocupacionRepository.merge(ocupacion, datosAActualizar);

    // 4. Guardar cambios
    const ocupacionActualizada = await this.ocupacionRepository.save(ocupacion);

    return new ResultWithData<Ocupacion>(
      true,
      'Registro de ocupación actualizado exitosamente',
      ocupacionActualizada,
    );
  }

  /*
  async remove(id: number): Promise<ResultWithData<boolean>> {
    const ocupacion = await this.ocupacionRepository.findOneBy({ id });
    if (!ocupacion) {
      throw new NotFoundException(
        `El registro de ocupación con ID ${id} no fue encontrado`,
      );
    }

    await this.ocupacionRepository.remove(ocupacion);

    return new ResultWithData<boolean>(
      true,
      'Registro de ocupación eliminado exitosamente',
      true,
    );
  }
  */
}
