import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';
import { Delito } from '../entities/delito.entity';
import { DelitoDto } from '../dto/delito.dto';
import { ResultWithData } from 'src/common/dto/result.dto';
import { PaginatedResult } from 'src/common/dto/paginated.result.dto';
import { Juridico } from '../entities/juridico.entity';

@Injectable()
export class DelitoService {
  constructor(
    @InjectRepository(Delito)
    private readonly delitoRepository: Repository<Delito>,
    @InjectRepository(Juridico)
    private readonly juridicoRepository: Repository<Juridico>,
  ) {}

  async create(delitoDto: DelitoDto): Promise<ResultWithData<Delito>> {
    // 1. Buscamos si ya existe un delito con ese mismo nombre
    const existe = await this.delitoRepository.findOneBy({
      nombre: delitoDto.nombre,
    });

    // 2. Si existe, retornamos FALSE y NULL en la data
    if (existe) {
      return new ResultWithData<Delito>(
        false, // success: false
        `El delito '${delitoDto.nombre}' ya existe en la base de datos.`, // message
        null, // data: null (porque no se creó nada)
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
      return new ResultWithData<Delito>(
        false, // success: false
        `El delito con ID ${id} no fue encontrado`, // message
        null, // data: null
      );
    }
    return new ResultWithData<Delito>(
      true,
      'Delito recuperado exitosamente',
      delito,
    );
  }

  async update(
    id: number,
    updateDelitoDto: DelitoDto,
  ): Promise<ResultWithData<Delito>> {
    const delito = await this.delitoRepository.findOneBy({ id });
    if (!delito) {
      return new ResultWithData<Delito>(
        false, // success: false
        `El delito con ID ${id} no fue encontrado`, // message
        null, // data: null
      );
    }

    // Si cambian el nombre, verificar que no choque con otro existente
    if (updateDelitoDto.nombre && updateDelitoDto.nombre !== delito.nombre) {
      const existeNombre = await this.delitoRepository.findOneBy({
        nombre: updateDelitoDto.nombre,
      });
      if (existeNombre) {
        return new ResultWithData<Delito>(
          false, // success: false
          `Ya existe otro delito llamado '${updateDelitoDto.nombre}'`, // message
          null, // data: null
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
      return new ResultWithData<boolean>(
        false, // success: false
        `El delito con ID ${id} no fue encontrado`, // message
        false, // data: false
      );
    }

    const juridicoCount = await this.juridicoRepository.count({
      where: { delito: { id } },
    });
    if (juridicoCount > 0) {
      return new ResultWithData<boolean>(
        false,
        'No se puede eliminar el delito porque tiene registros asociados',
        false,
      );
    }

    await this.delitoRepository.remove(delito);

    return new ResultWithData<boolean>(
      true,
      'Delito eliminado exitosamente',
      true,
    );
  }
}
