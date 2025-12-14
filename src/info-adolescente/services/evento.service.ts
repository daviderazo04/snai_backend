import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';
import { Evento } from '../entities/evento.entity'; // Asegúrate de la ruta
import { EventoDto } from '../dto/evento.dto';
import { ResultWithData } from 'src/common/dto/result.dto';
import { PaginatedResult } from 'src/common/dto/paginated.result.dto';

@Injectable()
export class EventoService {
  constructor(
    @InjectRepository(Evento)
    private readonly eventoRepository: Repository<Evento>,
  ) {}

  async create(eventoDto: EventoDto): Promise<ResultWithData<Evento>> {
    // 1. Validar duplicados (buscamos por 'descripcion' que es el campo real en BD)
    const existe = await this.eventoRepository.findOneBy({
      descripcion: eventoDto.nombre,
    });

    if (existe) {
      throw new ConflictException(
        `El evento '${eventoDto.nombre}' ya existe en la base de datos.`,
      );
    }

    // 2. Mapeo manual: DTO.nombre -> Entity.descripcion
    const nuevoEvento = this.eventoRepository.create({
      descripcion: eventoDto.nombre,
    });

    const eventoGuardado = await this.eventoRepository.save(nuevoEvento);

    return new ResultWithData<Evento>(
      true,
      'Evento creado exitosamente',
      eventoGuardado,
    );
  }

  async findAllPaginated(
    termino: string = '',
    page: number = 1,
    size: number = 10,
  ): Promise<PaginatedResult<Evento>> {
    const skip = (page - 1) * size;

    if (termino) {
      const [eventos, total] = await this.eventoRepository.findAndCount({
        where: { descripcion: ILike(`%${termino}%`) }, // Buscamos en 'descripcion'
        take: size,
        skip: skip,
        order: { descripcion: 'ASC' },
      });

      const totalPages = Math.ceil(total / size);
      return new PaginatedResult(eventos, totalPages, page, size);
    }

    const [eventos, total] = await this.eventoRepository.findAndCount({
      take: size,
      skip: skip,
      order: { descripcion: 'ASC' },
    });

    const totalPages = Math.ceil(total / size);
    return new PaginatedResult(eventos, totalPages, page, size);
  }

  async findOne(id: number): Promise<ResultWithData<Evento>> {
    const evento = await this.eventoRepository.findOneBy({ id });

    if (!evento) {
      throw new NotFoundException(`El evento con ID ${id} no fue encontrado`);
    }

    return new ResultWithData<Evento>(
      true,
      'Evento recuperado exitosamente',
      evento,
    );
  }

  async update(
    id: number,
    updateEventoDto: Partial<EventoDto>,
  ): Promise<ResultWithData<Evento>> {
    // 1. Buscar existente
    const evento = await this.eventoRepository.findOneBy({ id });
    if (!evento) {
      throw new NotFoundException(`El evento con ID ${id} no fue encontrado`);
    }

    // 2. Validar nombre duplicado si se intenta cambiar
    if (
      updateEventoDto.nombre &&
      updateEventoDto.nombre !== evento.descripcion
    ) {
      const existeNombre = await this.eventoRepository.findOneBy({
        descripcion: updateEventoDto.nombre,
      });
      if (existeNombre) {
        throw new ConflictException(
          `Ya existe otro evento llamado '${updateEventoDto.nombre}'`,
        );
      }
      // Actualizamos el campo descripcion con el nuevo nombre
      evento.descripcion = updateEventoDto.nombre;
    }

    // 3. Guardar cambios
    // Nota: Como hicimos la asignación manual arriba (evento.descripcion = ...),
    // el .save() detectará el cambio.
    const eventoActualizado = await this.eventoRepository.save(evento);

    return new ResultWithData<Evento>(
      true,
      'Evento actualizado exitosamente',
      eventoActualizado,
    );
  }

  async remove(id: number): Promise<ResultWithData<boolean>> {
    const evento = await this.eventoRepository.findOneBy({ id });
    if (!evento) {
      throw new NotFoundException(`El evento con ID ${id} no fue encontrado`);
    }

    await this.eventoRepository.remove(evento);

    return new ResultWithData<boolean>(
      true,
      'Evento eliminado exitosamente',
      true,
    );
  }
}
