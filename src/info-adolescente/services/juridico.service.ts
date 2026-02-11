import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';
import { Juridico } from '../entities/juridico.entity';
import { Adolescente } from '../../adolescente/entities/adolescente.entity';
import { Delito } from '../entities/delito.entity';
import { CreateJuridicoDto } from '../dto/juridico.dto';
import { ResultWithData } from 'src/common/dto/result.dto';
import { PaginatedResult } from 'src/common/dto/paginated.result.dto';

@Injectable()
export class JuridicoService {
  constructor(
    @InjectRepository(Juridico)
    private readonly juridicoRepository: Repository<Juridico>,
    @InjectRepository(Adolescente)
    private readonly adolescenteRepository: Repository<Adolescente>,
    @InjectRepository(Delito)
    private readonly delitoRepository: Repository<Delito>,
  ) {}

  async create(
    createJuridicoDto: CreateJuridicoDto,
  ): Promise<ResultWithData<Juridico>> {
    // 1. Validar existencia del Adolescente
    const adolescente = await this.adolescenteRepository.findOneBy({
      id: createJuridicoDto.adolescenteId,
    });
    if (!adolescente) {
      return new ResultWithData<Juridico>(
        false,
        `No se encontró el Adolescente con ID ${createJuridicoDto.adolescenteId}`,
        null,
      );
    }

    // 2. Validar existencia del Delito
    const delito = await this.delitoRepository.findOneBy({
      id: createJuridicoDto.delitoId,
    });
    if (!delito) {
      return new ResultWithData<Juridico>(
        false,
        `No se encontró el Delito con ID ${createJuridicoDto.delitoId}`,
        null,
      );
    }

    // 3. Separar los IDs del resto de datos para el mapeo limpio
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { adolescenteId, delitoId, ...datosJuridico } = createJuridicoDto;

    // Si el recurso es 'N', forzamos la fecha a null
    if (datosJuridico.casacionRecurso === 'N') {
      datosJuridico.casacionFecha = null;
    }

    // 4. Crear la entidad
    const nuevoJuridico = this.juridicoRepository.create({
      adolescente: adolescente,
      delito: delito,
      ...datosJuridico,
    } as unknown as Juridico);

    const juridicoGuardado = await this.juridicoRepository.save(nuevoJuridico);

    return new ResultWithData<Juridico>(
      true,
      'Registro jurídico creado exitosamente',
      juridicoGuardado,
    );
  }

  async findAllPaginated(
    termino: string = '',
    page: number = 1,
    size: number = 10,
    adolescenteId?: number, // Filtro opcional
    delitoId?: number, // Filtro opcional
  ): Promise<PaginatedResult<Juridico>> {
    const skip = (page - 1) * size;

    // Construcción dinámica del objeto where
    const where: any = {};

    // 1. Filtro por término (Número de Causa)
    if (termino) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      where.numeroCausa = ILike(`%${termino}%`);
    }

    // 2. Filtro por Adolescente (Relación)
    if (adolescenteId) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      where.adolescente = { id: adolescenteId };
    }

    // 3. Filtro por Delito (Relación)
    if (delitoId) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      where.delito = { id: delitoId };
    }

    const [juridicos, total] = await this.juridicoRepository.findAndCount({
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      where,
      relations: ['adolescente', 'delito'],
      order: { fechaInicio: 'DESC' },
      take: size,
      skip: skip,
    });

    const totalPages = Math.ceil(total / size);
    return new PaginatedResult(juridicos, totalPages, page, size);
  }

  async findOne(id: number): Promise<ResultWithData<Juridico>> {
    const juridico = await this.juridicoRepository.findOne({
      where: { id },
      relations: ['adolescente', 'delito'],
    });

    if (!juridico) {
      return new ResultWithData<Juridico>(
        false,
        `El registro jurídico con ID ${id} no fue encontrado`,
        null,
      );
    }

    return new ResultWithData<Juridico>(
      true,
      'Registro jurídico recuperado exitosamente',
      juridico,
    );
  }

  async update(
    id: number,
    updateJuridicoDto: CreateJuridicoDto,
  ): Promise<ResultWithData<Juridico>> {
    // 1. Buscar el registro existente
    const juridico = await this.juridicoRepository.findOneBy({ id });
    if (!juridico) {
      return new ResultWithData<Juridico>(
        false,
        `El registro jurídico con ID ${id} no fue encontrado`,
        null,
      );
    }

    // 2. Si vienen IDs de relación en el DTO, hay que validarlos y actualizarlos
    if (updateJuridicoDto.adolescenteId) {
      const adolescente = await this.adolescenteRepository.findOneBy({
        id: updateJuridicoDto.adolescenteId,
      });
      if (!adolescente) {
        return new ResultWithData<Juridico>(
          false,
          `No se encontró el Adolescente con ID ${updateJuridicoDto.adolescenteId}`,
          null,
        );
      }
      juridico.adolescente = adolescente;
    }

    if (updateJuridicoDto.delitoId) {
      const delito = await this.delitoRepository.findOneBy({
        id: updateJuridicoDto.delitoId,
      });
      if (!delito) {
        return new ResultWithData<Juridico>(
          false,
          `No se encontró el Delito con ID ${updateJuridicoDto.delitoId}`,
          null,
        );
      }
      juridico.delito = delito;
    }

    // 3. Separar IDs para no sobrescribir propiedades innecesarias y actualizar campos simples
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { adolescenteId, delitoId, ...datosAActualizar } = updateJuridicoDto;

    if (datosAActualizar.casacionRecurso === 'N') {
      datosAActualizar.casacionFecha = null;
    }

    // TypeORM merge actualiza las propiedades simples del objeto juridico con lo que venga en datosAActualizar
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    this.juridicoRepository.merge(juridico, datosAActualizar as any);

    // 4. Guardar cambios
    const juridicoActualizado = await this.juridicoRepository.save(juridico);

    return new ResultWithData<Juridico>(
      true,
      'Registro jurídico actualizado exitosamente',
      juridicoActualizado,
    );
  }

  /*
  async remove(id: number): Promise<ResultWithData<boolean>> {
    const juridico = await this.juridicoRepository.findOneBy({ id });
    if (!juridico) {
      throw new NotFoundException(
        `El registro jurídico con ID ${id} no fue encontrado`,
      );
    }

    await this.juridicoRepository.remove(juridico);

    return new ResultWithData<boolean>(
      true,
      'Registro jurídico eliminado exitosamente',
      true,
    );
  }
*/
}
