import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Canton } from '../entities/canton.entity';
import { Equal, ILike, Repository } from 'typeorm';
import { Provincia } from '../entities/provincia.entity';
import { Cai } from '../entities/cai.entity';
import { CaiPayloadDto } from '../dto/cai.payload.dto';
import { ResultWithData, SimpleResult } from '../../common/dto/result.dto';
import { PaginatedResult } from '../../common/dto/paginated.result.dto';
import { Estado } from '../../common/enums/estado.enum';
import { PutLocalidadesDto } from '../dto/put.localidades.dto';

@Injectable()
export class CaiService {
  constructor(
    @InjectRepository(Canton)
    private cantonRepository: Repository<Canton>,
    @InjectRepository(Provincia)
    private provinciaRepository: Repository<Provincia>,
    @InjectRepository(Cai)
    private caiRepository: Repository<Cai>,
  ) {}
  async getPaginatedCais(
    nombre: string = '',
    page: number = 1,
    size: number = 10,
  ): Promise<PaginatedResult<Cai>> {
    //Se envia canton
    const skip = (page - 1) * size;
    if (nombre == '') {
      const [cais, totales] = await this.caiRepository.findAndCount({
        take: size,
        skip: skip,
        where: { estado: Equal(Estado.ACTIVO) },
        relations: ['canton', 'canton.provincia'],
      });
      const totalPages = Math.ceil(totales / size);
      return new PaginatedResult(cais, totalPages, page, size);
    } else {
      const [cais, totales] = await this.caiRepository.findAndCount({
        where: { nombre: ILike(`%${nombre}%`), estado: Equal(Estado.ACTIVO) },
        take: size,
        skip: skip,
        relations: ['canton', 'canton.provincia'],
      });
      const totalPages = Math.ceil(totales / size);
      return new PaginatedResult(cais, totalPages, page, size);
    }
  }
  async createCai(payload: CaiPayloadDto): Promise<ResultWithData<Cai>> {
    try {
      const canton = await this.cantonRepository.findOneBy({
        id: payload.cantonId,
      });
      if (!canton)
        return new ResultWithData<Cai>(
          false,
          'No existe el canton con el id ingresado',
          null,
        );
      const cai = this.caiRepository.create({
        nombre: payload.nombre,
        canton: canton,
      });
      const savedCai = await this.caiRepository.save(cai);
      return new ResultWithData<Cai>(true, 'Cai creado exitosamente', savedCai);
    } catch (e) {
      const err = e as Error;
      return new ResultWithData<Cai>(false, err.message, null);
    }
  }
  async editCai(
    id: number,
    payload: PutLocalidadesDto,
  ): Promise<ResultWithData<Cai>> {
    try {
      const cai = await this.caiRepository.findOneBy({ id: id });
      if (!cai) throw new Error('Cai no encontrado');
      cai.nombre = payload.nombre;
      const savedCai = await this.caiRepository.save(cai);
      return new ResultWithData<Cai>(
        true,
        'Cai actualizado exitosamente',
        savedCai,
      );
    } catch (e) {
      const err = e as Error;
      return new ResultWithData<Cai>(false, err.message, null);
    }
  }
  async softDeleteCai(id: number): Promise<SimpleResult> {
    try {
      const cai = await this.caiRepository.findOneBy({ id: id });
      if (!cai) throw new Error('Cai no encontrado');
      cai.estado = Estado.INACTIVO;
      await this.caiRepository.save(cai);
      return new SimpleResult(true, 'Cai eliminado');
    } catch (e) {
      const err = e as Error;
      return new SimpleResult(false, err.message);
    }
  }
}
