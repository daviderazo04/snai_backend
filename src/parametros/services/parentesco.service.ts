import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Parentesco } from '../entities/parentesco.entity';
import { ParamPayload } from '../dto/param.payload';
import { ResultWithData, SimpleResult } from '../../common/dto/result.dto';
import { PaginatedResult } from '../../common/dto/paginated.result.dto';
import { Estado } from '../../common/enums/estado.enum';

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
    const savedParentesco = await this.parentescoRepository.save(parentesco);
    return new ResultWithData<Parentesco>(
      true,
      'Parentesco creado exitosamente',
      savedParentesco,
    );
  }
  async softDeleteParentesco(id: number): Promise<SimpleResult> {
    try {
      const parentesco = await this.parentescoRepository.findOneBy({ id: id });
      if (!parentesco)
        throw new Error('No existe el parentesco con el id ingresado');
      parentesco.estado = Estado.INACTIVO;
      await this.parentescoRepository.save(parentesco);
      return new SimpleResult(true, 'Parentesco eliminado exitosamente');
    } catch (e) {
      const err = e as Error;
      return new SimpleResult(false, err.message);
    }
  }
  async editParentesco(
    id: number,
    payload: ParamPayload,
  ): Promise<ResultWithData<Parentesco>> {
    try {
      const parentesco = await this.parentescoRepository.findOneBy({ id: id });
      if (!parentesco)
        throw new Error('No existe el parentesco con el id ingresado');
      parentesco.nombre = payload.nombre;
      const savedParentesco = await this.parentescoRepository.save(parentesco);
      return new ResultWithData<Parentesco>(
        true,
        'Parentesco editado exitosamente',
        savedParentesco,
      );
    } catch (e) {
      const err = e as Error;
      return new ResultWithData<Parentesco>(false, err.message, null);
    }
  }
}
