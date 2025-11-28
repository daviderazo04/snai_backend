import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Parentesco } from '../entities/parentesco.entity';
import { ParamPayload } from '../dto/param.payload';
import { ResultWithData } from '../../common/dto/result.dto';
import { PaginatedResult } from '../../common/dto/paginated.result.dto';

@Injectable()
export class ParentescoService {
  constructor(
    @InjectRepository(Parentesco)
    private parentescoRepository: Repository<Parentesco>,
  ) {}
  async getPaginatedParentesco(
    nombre: string = '',
    page: number = 1,
    size: number = 10,
  ): Promise<PaginatedResult<Parentesco>> {
    if (nombre == '') {
      const [parentescos, totales] =
        await this.parentescoRepository.findAndCount({
          take: size,
          skip: (page - 1) * size,
        });
      const totalPages = Math.ceil(totales / size);
      return new PaginatedResult(parentescos, totalPages, page, size);
    } else {
      const [parentescos, totales] =
        await this.parentescoRepository.findAndCount({
          where: { nombre: nombre },
          take: size,
          skip: (page - 1) * size,
        });
      const totalPages = Math.ceil(totales / size);
      return new PaginatedResult(parentescos, totalPages, page, size);
    }
  }
  async createParentesco(
    payload: ParamPayload,
  ): Promise<ResultWithData<Parentesco>> {
    const parentesco = this.parentescoRepository.create({
      nombre: payload.nombre,
    });
    const savedParentesco =
      await this.parentescoRepository.save(parentesco);
    return new ResultWithData<Parentesco>(
      true,
      'Parentesco creado exitosamente',
      savedParentesco,
    );
  }
}
