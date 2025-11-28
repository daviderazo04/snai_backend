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
import { NacionalidadService } from '../services/nacionalidad.service';
import { ParamPayload } from '../dto/param.payload';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { PermisosGuard } from '../../common/guards/permisos.guard';
import { ResultWithData } from '../../common/dto/result.dto';
import { PaginatedResult } from '../../common/dto/paginated.result.dto';
import { Nacionalidad } from '../entities/nacionalidad.entity';

@ApiTags('Nacionalidad')
@ApiExtraModels(ResultWithData, PaginatedResult, Nacionalidad)
@UseGuards(JwtAuthGuard, PermisosGuard)
@Controller('nacionalidad')
export class NacionalidadController {
  constructor(private readonly nacionalidadService: NacionalidadService) {}
  @Post()
  @ApiOperation({ summary: 'Crear una nacionalidad' })
  @ApiBody({ type: ParamPayload })
  @ApiCreatedResponse({
    description: 'Nacionalidad creada correctamente',
    schema: {
      allOf: [
        { $ref: getSchemaPath(ResultWithData) },
        {
          properties: {
            data: { $ref: getSchemaPath(Nacionalidad) },
          },
        },
      ],
    },
  })
  @ApiBadRequestResponse({
    description:
      'El payload no cumple las validaciones o no se pudo crear la nacionalidad',
  })
  async createNacionalidad(
    @Body() payload: ParamPayload,
  ): Promise<ResultWithData<Nacionalidad>> {
    return await this.nacionalidadService.createNacionalidad(payload);
  }
  @Get()
  @ApiOperation({
    summary: 'Listar nacionalidades de forma paginada',
  })
  @ApiQuery({ name: 'nombre', required: false, type: String })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'size', required: false, type: Number })
  @ApiOkResponse({
    description: 'Listado paginado de nacionalidades',
    schema: {
      allOf: [
        { $ref: getSchemaPath(PaginatedResult) },
        {
          properties: {
            data: {
              type: 'array',
              items: { $ref: getSchemaPath(Nacionalidad) },
            },
          },
        },
      ],
    },
  })
  async getNacionalidad(
    @Query('nombre') nombre: string = '',
    @Query('page') page: number = 1,
    @Query('size') size: number = 10,
  ): Promise<PaginatedResult<Nacionalidad>> {
    return await this.nacionalidadService.getPaginatedNacionalidad(
      nombre,
      page,
      size,
    );
  }
}
