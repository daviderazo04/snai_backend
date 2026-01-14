import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Equal, ILike, Repository } from 'typeorm';
import { Adolescente } from '../entities/adolescente.entity';
import { Cai } from 'src/localidades/entities/cai.entity';
import { Nacionalidad } from 'src/parametros/entities/nacionalidad.entity';
import { EstadoCivil } from 'src/parametros/entities/estadoCivil';
import { Gdos } from 'src/parametros/entities/gdos';
import { Etnia } from 'src/parametros/entities/etnia.entity';
import { Canton } from 'src/localidades/entities/canton.entity';
import { ResultWithData, SimpleResult } from 'src/common/dto/result.dto';
import { AdolescentePayloadDto } from '../dto/adolescente.payload.dto';
import { PaginatedResult } from 'src/common/dto/paginated.result.dto';
import { Estado } from 'src/common/enums/estado.enum';

@Injectable()
export class AdolescenteService {
  constructor(
    @InjectRepository(Adolescente)
    private readonly adolescenteRepository: Repository<Adolescente>,
    @InjectRepository(Cai)
    private readonly caiRepository: Repository<Cai>,
    @InjectRepository(Nacionalidad)
    private readonly nacionalidadRepository: Repository<Nacionalidad>,
    @InjectRepository(EstadoCivil)
    private readonly estadoCivilRepository: Repository<EstadoCivil>,
    @InjectRepository(Gdos)
    private readonly gdosRepository: Repository<Gdos>,
    @InjectRepository(Etnia)
    private readonly etniaRepository: Repository<Etnia>,
    @InjectRepository(Canton)
    private readonly cantonRepository: Repository<Canton>,
  ) {}

  async createAdolescente(
    payload: AdolescentePayloadDto,
  ): Promise<ResultWithData<Adolescente>> {
    try {
      const [cai, nacionalidad, estadoCivil, gdos, etnia, canton] =
        await Promise.all([
          this.caiRepository.findOneBy({ id: payload.caiId }),
          this.nacionalidadRepository.findOneBy({ id: payload.nacionalidadId }),
          this.estadoCivilRepository.findOneBy({ id: payload.estadoCivilId }),
          this.gdosRepository.findOneBy({ id: payload.gdosId }),
          this.etniaRepository.findOneBy({ id: payload.etniaId }),
          this.cantonRepository.findOneBy({ id: payload.cantonId }),
        ]);

      if (!cai)
        return new ResultWithData<Adolescente>(
          false,
          'No existe el CAI con el id ingresado',
          null,
        );
      if (!nacionalidad)
        return new ResultWithData<Adolescente>(
          false,
          'No existe la nacionalidad con el id ingresado',
          null,
        );
      if (!estadoCivil)
        return new ResultWithData<Adolescente>(
          false,
          'No existe el estado civil con el id ingresado',
          null,
        );
      if (!gdos)
        return new ResultWithData<Adolescente>(
          false,
          'No existe el grado de instrucción con el id ingresado',
          null,
        );
      if (!etnia)
        return new ResultWithData<Adolescente>(
          false,
          'No existe la etnia con el id ingresado',
          null,
        );
      if (!canton)
        return new ResultWithData<Adolescente>(
          false,
          'No existe el cantón con el id ingresado',
          null,
        );

      const adolescente = this.adolescenteRepository.create({
        nombre: payload.nombre,
        apellido: payload.apellido,
        fecha_nac: new Date(payload.fecha_nac),
        hijos: payload.hijos,
        fecha_ingr: new Date(payload.fecha_ingr),
        cedula: payload.cedula,
        hijoPpl: payload.hijoPpl,
        reincide: payload.reincide,
        observaciones: payload.observaciones,
        cai,
        nacionalidad,
        estadoCivil,
        gdos,
        etnia,
        canton,
      });

      const saved = await this.adolescenteRepository.save(adolescente);
      return new ResultWithData<Adolescente>(
        true,
        'Adolescente creado exitosamente',
        saved,
      );
    } catch (error) {
      return new ResultWithData<Adolescente>(
        false,
        (error as Error).message,
        null,
      );
    }
  }

  async getAdolescentes(
    nombre: string = '',
    cedula: string = '',
    page: number = 1,
    size: number = 10,
  ): Promise<PaginatedResult<Adolescente>> {
    const skip = (page - 1) * size;
    const where: Record<string, unknown> = { estado: Equal(Estado.ACTIVO) };

    if (nombre) where.nombre = ILike(`%${nombre}%`);
    if (cedula) where.cedula = ILike(`%${cedula}%`);

    const [adolescentes, total] = await this.adolescenteRepository.findAndCount(
      {
        where,
        take: size,
        skip,
        relations: [
          'cai',
          'nacionalidad',
          'estadoCivil',
          'gdos',
          'etnia',
          'canton',
          'traslados',
        ],
      },
    );

    const totalPages = Math.ceil(total / size);
    return new PaginatedResult(adolescentes, totalPages, page, size);
  }

  async updateAdolescente(
    id: number,
    payload: AdolescentePayloadDto,
  ): Promise<ResultWithData<Adolescente>> {
    try {
      const adolescente = await this.adolescenteRepository.findOneBy({ id });
      if (!adolescente)
        return new ResultWithData<Adolescente>(
          false,
          'No existe el adolescente con el id ingresado',
          null,
        );

      const [cai, nacionalidad, estadoCivil, gdos, etnia, canton] =
        await Promise.all([
          this.caiRepository.findOneBy({ id: payload.caiId }),
          this.nacionalidadRepository.findOneBy({ id: payload.nacionalidadId }),
          this.estadoCivilRepository.findOneBy({ id: payload.estadoCivilId }),
          this.gdosRepository.findOneBy({ id: payload.gdosId }),
          this.etniaRepository.findOneBy({ id: payload.etniaId }),
          this.cantonRepository.findOneBy({ id: payload.cantonId }),
        ]);

      if (!cai)
        return new ResultWithData<Adolescente>(
          false,
          'No existe el CAI con el id ingresado',
          null,
        );
      if (!nacionalidad)
        return new ResultWithData<Adolescente>(
          false,
          'No existe la nacionalidad con el id ingresado',
          null,
        );
      if (!estadoCivil)
        return new ResultWithData<Adolescente>(
          false,
          'No existe el estado civil con el id ingresado',
          null,
        );
      if (!gdos)
        return new ResultWithData<Adolescente>(
          false,
          'No existe el grado de instrucción con el id ingresado',
          null,
        );
      if (!etnia)
        return new ResultWithData<Adolescente>(
          false,
          'No existe la etnia con el id ingresado',
          null,
        );
      if (!canton)
        return new ResultWithData<Adolescente>(
          false,
          'No existe el cantón con el id ingresado',
          null,
        );

      adolescente.nombre = payload.nombre;
      adolescente.apellido = payload.apellido;
      adolescente.fecha_nac = new Date(payload.fecha_nac);
      adolescente.hijos = payload.hijos;
      adolescente.fecha_ingr = new Date(payload.fecha_ingr);
      adolescente.cedula = payload.cedula;
      adolescente.hijoPpl = payload.hijoPpl;
      adolescente.reincide = payload.reincide;
      adolescente.observaciones = payload.observaciones;
      adolescente.cai = cai;
      adolescente.nacionalidad = nacionalidad;
      adolescente.estadoCivil = estadoCivil;
      adolescente.gdos = gdos;
      adolescente.etnia = etnia;
      adolescente.canton = canton;

      const saved = await this.adolescenteRepository.save(adolescente);
      return new ResultWithData<Adolescente>(
        true,
        'Adolescente actualizado exitosamente',
        saved,
      );
    } catch (error) {
      return new ResultWithData<Adolescente>(
        false,
        (error as Error).message,
        null,
      );
    }
  }

  async softDeleteAdolescente(id: number): Promise<SimpleResult> {
    try {
      const adolescente = await this.adolescenteRepository.findOneBy({
        id: id,
      });
      if (!adolescente)
        return new SimpleResult(
          false,
          'No existe el adolescente con el id ingresado',
        );
      adolescente.estado = Estado.INACTIVO;
      await this.adolescenteRepository.save(adolescente);
      return new SimpleResult(true, 'Adolescente eliminado exitosamente');
    } catch (error) {
      return new SimpleResult(false, (error as Error).message);
    }
  }
}
