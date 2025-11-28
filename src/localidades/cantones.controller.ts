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
import { CantonPayload } from './dto/canton.payload.dto';
import { ResultWithData } from '../common/dto/result.dto';
import { Canton } from './entities/canton.entity';
import { PaginatedResult } from '../common/dto/paginated.result.dto';
import { LocalidadService } from './localidad.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { PermisosGuard } from '../common/guards/permisos.guard';

@ApiTags('Cantones')
@ApiExtraModels(ResultWithData, PaginatedResult, Canton)
@UseGuards(JwtAuthGuard, PermisosGuard)
@Controller('cantones')
export class CantonesController {
  constructor(private readonly localidadService: LocalidadService) {}

  @Post()
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
    return this.localidadService.createCanton(payload);
  }

  @Get()
  @ApiOperation({ summary: 'Listar cantones paginados' })
  @ApiQuery({ name: 'nombre', required: false, type: String })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'size', required: false, type: Number })
  @ApiOkResponse({
    description: 'Listado paginado de cantones',
    schema: {
      allOf: [
        { $ref: getSchemaPath(PaginatedResult) },
        {
          properties: {
            data: {
              type: 'array',
              items: { $ref: getSchemaPath(Canton) },
            },
          },
        },
      ],
    },
  })
  async getCantones(
    @Query('nombre') nombre: string = '',
    @Query('page') page: number = 1,
    @Query('size') size: number = 10,
  ): Promise<PaginatedResult<Canton>> {
    return this.localidadService.getPaginatedCanton(nombre, page, size);
  }
}
