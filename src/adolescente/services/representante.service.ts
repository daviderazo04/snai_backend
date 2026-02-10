import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';
import { Representante } from '../entities/representante.entity';
import { Nacionalidad } from 'src/parametros/entities/nacionalidad.entity';
import { Parentesco } from 'src/parametros/entities/parentesco.entity';
import { Canton } from 'src/localidades/entities/canton.entity';
import { RepresentantePayloadDto } from '../dto/representante.payload.dto';
import { ResultWithData, SimpleResult } from 'src/common/dto/result.dto';
import { PaginatedResult } from 'src/common/dto/paginated.result.dto';
import { RepInfractor } from '../entities/repInfractor.entity';

@Injectable()
export class RepresentanteService {
  constructor(
    @InjectRepository(Representante)
    private readonly representanteRepository: Repository<Representante>,
    @InjectRepository(Nacionalidad)
    private readonly nacionalidadRepository: Repository<Nacionalidad>,
    @InjectRepository(Parentesco)
    private readonly parentescoRepository: Repository<Parentesco>,
    @InjectRepository(Canton)
    private readonly cantonRepository: Repository<Canton>,
    @InjectRepository(RepInfractor)
    private readonly repInfractorRepository: Repository<RepInfractor>,
  ) {}

  async createRepresentante(
    payload: RepresentantePayloadDto,
  ): Promise<ResultWithData<Representante>> {
    try {
      const [nacionalidad, parentesco, canton] = await Promise.all([
        this.nacionalidadRepository.findOneBy({ id: payload.nacionalidadId }),
        this.parentescoRepository.findOneBy({ id: payload.parentescoId }),
        this.cantonRepository.findOneBy({ id: payload.cantonId }),
      ]);

      if (!nacionalidad)
        return new ResultWithData<Representante>(
          false,
          'No existe la nacionalidad con el id ingresado',
          null,
        );
      if (!parentesco)
        return new ResultWithData<Representante>(
          false,
          'No existe el parentesco con el id ingresado',
          null,
        );
      if (!canton)
        return new ResultWithData<Representante>(
          false,
          'No existe el cantón con el id ingresado',
          null,
        );

      const representante = this.representanteRepository.create({
        nombre: payload.nombre,
        apellido: payload.apellido,
        cedula: payload.cedula,
        nacionalidad,
        parentesco,
        canton,
      });

      const saved = await this.representanteRepository.save(representante);
      return new ResultWithData<Representante>(
        true,
        'Representante creado exitosamente',
        saved,
      );
    } catch (error) {
      return new ResultWithData<Representante>(
        false,
        (error as Error).message,
        null,
      );
    }
  }

  async getRepresentantes(
    nombre: string = '',
    cedula: string = '',
    page: number = 1,
    size: number = 10,
  ): Promise<PaginatedResult<Representante>> {
    const skip = (page - 1) * size;
    const where: Record<string, unknown> = {};

    if (nombre) where.nombre = ILike(`%${nombre}%`);
    if (cedula) where.cedula = ILike(`%${cedula}%`);

    const [representantes, total] =
      await this.representanteRepository.findAndCount({
        where,
        take: size,
        skip,
        relations: ['nacionalidad', 'parentesco', 'canton'],
      });

    const totalPages = Math.ceil(total / size);
    return new PaginatedResult(representantes, totalPages, page, size);
  }

  async updateRepresentante(
    id: number,
    payload: RepresentantePayloadDto,
  ): Promise<ResultWithData<Representante>> {
    try {
      const representante = await this.representanteRepository.findOneBy({
        id,
      });
      if (!representante)
        return new ResultWithData<Representante>(
          false,
          'No existe el representante con el id ingresado',
          null,
        );

      const [nacionalidad, parentesco, canton] = await Promise.all([
        this.nacionalidadRepository.findOneBy({ id: payload.nacionalidadId }),
        this.parentescoRepository.findOneBy({ id: payload.parentescoId }),
        this.cantonRepository.findOneBy({ id: payload.cantonId }),
      ]);

      if (!nacionalidad)
        return new ResultWithData<Representante>(
          false,
          'No existe la nacionalidad con el id ingresado',
          null,
        );
      if (!parentesco)
        return new ResultWithData<Representante>(
          false,
          'No existe el parentesco con el id ingresado',
          null,
        );
      if (!canton)
        return new ResultWithData<Representante>(
          false,
          'No existe el cantón con el id ingresado',
          null,
        );

      representante.nombre = payload.nombre;
      representante.apellido = payload.apellido;
      representante.cedula = payload.cedula;
      representante.nacionalidad = nacionalidad;
      representante.parentesco = parentesco;
      representante.canton = canton;

      const saved = await this.representanteRepository.save(representante);
      return new ResultWithData<Representante>(
        true,
        'Representante actualizado exitosamente',
        saved,
      );
    } catch (error) {
      return new ResultWithData<Representante>(
        false,
        (error as Error).message,
        null,
      );
    }
  }

  async deleteRepresentante(id: number): Promise<SimpleResult> {
    try {
      const representante = await this.representanteRepository.findOneBy({
        id,
      });
      if (!representante)
        return new SimpleResult(
          false,
          'No existe el representante con el id ingresado',
        );
      const repInfractorCount = await this.repInfractorRepository.count({
        where: { representante: { id } },
      });
      if (repInfractorCount > 0) {
        return new SimpleResult(
          false,
          'No se puede eliminar el representante porque tiene registros asociados',
        );
      }
      await this.representanteRepository.remove(representante);
      return new SimpleResult(true, 'Representante eliminado exitosamente');
    } catch (error) {
      return new SimpleResult(false, (error as Error).message);
    }
  }
}
