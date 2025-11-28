import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Canton } from './entities/canton.entity';
import { ILike, Repository } from 'typeorm';
import { Provincia } from './entities/provincia.entity';
import { Cai } from './entities/cai.entity';
import { CaiPayloadDto } from './dto/cai.payload.dto';
import { ResultWithData } from '../common/dto/result.dto';
import { PaginatedResult } from '../common/dto/paginated.result.dto';

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
    const skip = (page - 1) * size;
    if (nombre == '') {
      const [cais, totales] = await this.caiRepository.findAndCount({
        take: size,
        skip: skip,
      });
      const totalPages = Math.ceil(totales / size);
      return new PaginatedResult(cais, totalPages, page, size);
    } else {
      const [cais, totales] = await this.caiRepository.findAndCount({
        where: { nombre: ILike(`%${nombre}%`) },
        take: size,
        skip: skip,
      });
      const totalPages = Math.ceil(totales / size);
      return new PaginatedResult(cais, totalPages, page, size);
    }
  }
  async createCai(payload: CaiPayloadDto): Promise<ResultWithData<Cai>> {
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
  }
}
