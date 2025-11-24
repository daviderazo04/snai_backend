import { Body, Controller, Post } from '@nestjs/common';
import { ProvinciaPayloadDto } from './dto/provincia.payload.dto';
import { LocalidadService } from './localidad.service';
import { ResultWithData } from '../common/dto/result.dto';
import { Provincia } from './entities/provincia.entity';

@Controller('localidades')
export class LocalidadesController {
  constructor(private readonly localidadService: LocalidadService) {}
  @Post()
  async create(
    @Body() provincia: ProvinciaPayloadDto,
  ): Promise<ResultWithData<Provincia>> {
    return await this.localidadService.createProvincia(provincia);
  }
}
