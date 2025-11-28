import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiCreatedResponse,
  ApiExtraModels,
  ApiOkResponse,
  ApiOperation,
  ApiQuery,
  ApiTags,
  getSchemaPath,
} from '@nestjs/swagger';
import { CaiService } from '../services/cai.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { PermisosGuard } from '../../common/guards/permisos.guard';
import { CaiPayloadDto } from '../dto/cai.payload.dto';
import { ResultWithData } from '../../common/dto/result.dto';
import { Cai } from '../entities/cai.entity';
import { PaginatedResult } from '../../common/dto/paginated.result.dto';
import { Canton } from '../entities/canton.entity';
import { Provincia } from '../entities/provincia.entity';

@ApiTags('CAI')
@ApiExtraModels(ResultWithData, PaginatedResult, Cai, Canton, Provincia)
@UseGuards(JwtAuthGuard, PermisosGuard)
@Controller('cai')
export class CaiController {
  constructor(private readonly caiService: CaiService) {}
  @Post()
  @ApiOperation({
    summary: 'Crear un CAI',
    description:
      'Crea un CAI asociado a un cantón y devuelve el objeto con su cantón y provincia.',
  })
  @ApiBody({ type: CaiPayloadDto })
  @ApiCreatedResponse({
    description: 'CAI creado correctamente',
    schema: {
      allOf: [
        { $ref: getSchemaPath(ResultWithData) },
        {
          properties: {
            data: { $ref: getSchemaPath(Cai) },
          },
        },
      ],
    },
  })
  @ApiBadRequestResponse({
    description:
      'El payload no cumple las validaciones o el cantón indicado no existe',
  })
  async createCai(@Body() payload: CaiPayloadDto) {
    return await this.caiService.createCai(payload);
  }

  @Get()
  @ApiOperation({
    summary: 'Listar CAI paginados',
    description: 'Devuelve CAIs de forma paginada',
  })
  @ApiQuery({ name: 'nombre', required: false, type: String })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'size', required: false, type: Number })
  @ApiOkResponse({
    description: 'Listado paginado de CAIs',
    schema: {
      allOf: [
        { $ref: getSchemaPath(PaginatedResult) },
        {
          properties: {
            data: {
              type: 'array',
              items: { $ref: getSchemaPath(Cai) },
            },
          },
        },
      ],
    },
  })
  async getCais(
    @Query('nombre') nombre: string = '',
    @Query('page') page: number = 1,
    @Query('size') size: number = 10,
  ) {
    return await this.caiService.getPaginatedCais(nombre, page, size);
  }
}
