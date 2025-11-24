import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Canton } from './entities/canton.entity';
import { Provincia } from './entities/provincia.entity';
import { ProvinciaPayloadDto } from './dto/provincia.payload.dto';
import { ResultWithData } from '../common/dto/result.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Usuario } from '../usuario/entities/usuario.entity';

@Injectable()
export class LocalidadService {
  constructor(
    @InjectRepository(Canton)
    private cantonRepository: Repository<Canton>,
    @InjectRepository(Provincia)
    private provinciaRepository: Repository<Provincia>,
  ) {}
  async createProvincia(
    provincia: ProvinciaPayloadDto,
  ): Promise<ResultWithData<Provincia>> {
    try {
      const newProvincia = this.provinciaRepository.create(provincia);
      const savedProvincia = await this.provinciaRepository.save(newProvincia);
      return new ResultWithData<Provincia>(
        true,
        'Provincia creada',
        savedProvincia,
      );
    } catch {
      return new ResultWithData<Provincia>(
        false,
        'Error al crear provincia',
        null,
      );
    }
  }
}
