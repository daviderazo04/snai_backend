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
import { ProvinciaPayloadDto } from './dto/provincia.payload.dto';
import { LocalidadService } from './localidad.service';
import { ResultWithData } from '../common/dto/result.dto';
import { Provincia } from './entities/provincia.entity';
import { CantonPayload } from './dto/canton.payload.dto';
import { Canton } from './entities/canton.entity';
import { PaginatedResult } from '../common/dto/paginated.result.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { PermisosGuard } from '../common/guards/permisos.guard';

@ApiTags('Localidades')
@ApiExtraModels(ResultWithData, PaginatedResult, Provincia, Canton)
@UseGuards(JwtAuthGuard, PermisosGuard)
@Controller('localidades')
export class LocalidadesController {
  constructor(private readonly localidadService: LocalidadService) {}
  @Post('provincia')
  @ApiOperation({ summary: 'Crear una nueva provincia' })
  @ApiBody({ type: ProvinciaPayloadDto })
  @ApiCreatedResponse({
    description: 'Provincia creada correctamente',
    schema: {
      allOf: [
        { $ref: getSchemaPath(ResultWithData) },
        {
          properties: {
            data: { $ref: getSchemaPath(Provincia) },
          },
        },
      ],
    },
  })
  @ApiBadRequestResponse({
    description:
      'El payload no cumple las validaciones o no se pudo crear la provincia',
  })
  async create(
    @Body() provincia: ProvinciaPayloadDto,
  ): Promise<ResultWithData<Provincia>> {
    return await this.localidadService.createProvincia(provincia);
  }
  @Post('canton')
  @ApiOperation({ summary: 'Crear un cantón asociado a una provincia' })
  @ApiBody({ type: CantonPayload })
  @ApiCreatedResponse({
    description: 'Cantón creado correctamente',
    schema: {
      allOf: [
        { $ref: getSchemaPath(ResultWithData) },
        {
          properties: {
            data: { $ref: getSchemaPath(Canton) },
          },
        },
      ],
    },
  })
  @ApiBadRequestResponse({
    description:
      'El payload no cumple las validaciones o la provincia indicada no existe',
  })
  async createCanton(
    @Body() payload: CantonPayload,
  ): Promise<ResultWithData<Canton>> {
    return await this.localidadService.createCanton(payload);
  }
  @Get()
  @ApiOperation({
    summary: 'Listar provincias con sus cantones de forma paginada',
  })
  @ApiQuery({ name: 'nombre', required: false, type: String })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'size', required: false, type: Number })
  @ApiOkResponse({
    description: 'Listado paginado de provincias con sus cantones',
    schema: {
      allOf: [
        { $ref: getSchemaPath(PaginatedResult) },
        {
          properties: {
            data: {
              type: 'array',
              items: { $ref: getSchemaPath(Provincia) },
            },
          },
        },
      ],
    },
  })
  async getLocalidades(
    @Query('nombre') nombre: string = '',
    @Query('page') page: number = 1,
    @Query('size') size: number = 10,
  ): Promise<PaginatedResult<Provincia>> {
    return await this.localidadService.getPaginatedProvincia(
      nombre,
      page,
      size,
    );
  }
}
