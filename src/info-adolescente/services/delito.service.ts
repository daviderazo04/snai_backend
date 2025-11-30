import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';
import { Delito } from '../entities/delito.entity';
import { DelitoDto } from '../dto/delito.dto';
import { ResultWithData } from 'src/common/dto/result.dto';
import { PaginatedResult } from 'src/common/dto/paginated.result.dto';

@Injectable()
export class DelitoService {
  constructor(
    @InjectRepository(Delito)
    private readonly delitoRepository: Repository<Delito>,
  ) {}

  async create(delitoDto: DelitoDto): Promise<ResultWithData<Delito>> {
    // 1. Buscamos si ya existe un delito con ese mismo nombre
    const existe = await this.delitoRepository.findOneBy({
      nombre: delitoDto.nombre,
    });

    // 2. Si existe, lanzamos un error 409 (Conflict)
    if (existe) {
      throw new ConflictException(
        `El delito '${delitoDto.nombre}' ya existe en la base de datos.`,
      );
    }

    // 3. Procedemos a crear
    const nuevoDelito = this.delitoRepository.create({
      nombre: delitoDto.nombre,
    });
    const delito = await this.delitoRepository.save(nuevoDelito);

    return new ResultWithData<Delito>(
      true,
      'Delito creado exitosamente',
      delito,
    );
  }

  async findAllPaginated(
    nombre: string = '',
    page: number = 1,
    size: number = 10,
  ): Promise<PaginatedResult<Delito>> {
    const skip = (page - 1) * size;

    if (nombre) {
      const [delitos, total] = await this.delitoRepository.findAndCount({
        where: { nombre: ILike(`%${nombre}%`) },
        take: size,
        skip: skip,
      });

      const totalPages = Math.ceil(total / size);
      return new PaginatedResult(delitos, totalPages, page, size);
    }

    const [delitos, total] = await this.delitoRepository.findAndCount({
      order: { nombre: 'ASC' },
      take: size,
      skip: skip,
    });

    const totalPages = Math.ceil(total / size);
    return new PaginatedResult(delitos, totalPages, page, size);
  }

  async findOne(id: number): Promise<ResultWithData<Delito>> {
    const delito = await this.delitoRepository.findOneBy({ id });
    if (!delito) {
      throw new NotFoundException(`El delito con ID ${id} no fue encontrado`);
    }
    return new ResultWithData<Delito>(
      true,
      'Delito recuperado exitosamente',
      delito,
    );
  }

  async update(
    id: number,
    updateDelitoDto: Partial<DelitoDto>,
  ): Promise<ResultWithData<Delito>> {
    const delito = await this.delitoRepository.findOneBy({ id });
    if (!delito) {
      throw new NotFoundException(`El delito con ID ${id} no fue encontrado`);
    }

    // Si cambian el nombre, verificar que no choque con otro existente
    if (updateDelitoDto.nombre && updateDelitoDto.nombre !== delito.nombre) {
      const existeNombre = await this.delitoRepository.findOneBy({
        nombre: updateDelitoDto.nombre,
      });
      if (existeNombre) {
        throw new ConflictException(
          `Ya existe otro delito llamado '${updateDelitoDto.nombre}'`,
        );
      }
    }

    this.delitoRepository.merge(delito, updateDelitoDto);

    const delitoActualizado = await this.delitoRepository.save(delito);

    return new ResultWithData<Delito>(
      true,
      'Delito actualizado exitosamente',
      delitoActualizado,
    );
  }

  async remove(id: number): Promise<ResultWithData<boolean>> {
    const delito = await this.delitoRepository.findOneBy({ id });
    if (!delito) {
      throw new NotFoundException(`El delito con ID ${id} no fue encontrado`);
    }

    await this.delitoRepository.remove(delito);

    return new ResultWithData<boolean>(
      true,
      'Delito eliminado exitosamente',
      true,
    );
  }
}
