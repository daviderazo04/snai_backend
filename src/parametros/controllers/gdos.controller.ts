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
import { GdosService } from '../services/gdos.service';
import { ParamPayload } from '../dto/param.payload';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { PermisosGuard } from '../../common/guards/permisos.guard';
import { ResultWithData } from '../../common/dto/result.dto';
import { PaginatedResult } from '../../common/dto/paginated.result.dto';
import { Gdos } from '../entities/gdos';

@ApiTags('Gdos')
@ApiExtraModels(ResultWithData, PaginatedResult, Gdos)
@UseGuards(JwtAuthGuard, PermisosGuard)
@Controller('gdos')
export class GdosController {
  constructor(private readonly gdosService: GdosService) {}
  @Post()
  @ApiOperation({ summary: 'Crear un grado' })
  @ApiBody({ type: ParamPayload })
  @ApiCreatedResponse({
    description: 'Gdos creado correctamente',
    schema: {
      allOf: [
        { $ref: getSchemaPath(ResultWithData) },
        {
          properties: {
            data: { $ref: getSchemaPath(Gdos) },
          },
        },
      ],
    },
  })
  @ApiBadRequestResponse({
    description:
      'El payload no cumple las validaciones o no se pudo crear el grado',
  })
  async createGdos(
    @Body() payload: ParamPayload,
  ): Promise<ResultWithData<Gdos>> {
    return await this.gdosService.createGdos(payload);
  }
  @Get()
  @ApiOperation({
    summary: 'Listar grados de forma paginada',
  })
  @ApiQuery({ name: 'nombre', required: false, type: String })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'size', required: false, type: Number })
  @ApiOkResponse({
    description: 'Listado paginado de grados',
    schema: {
      allOf: [
        { $ref: getSchemaPath(PaginatedResult) },
        {
          properties: {
            data: {
              type: 'array',
              items: { $ref: getSchemaPath(Gdos) },
            },
          },
        },
      ],
    },
  })
  async getGdos(
    @Query('nombre') nombre: string = '',
    @Query('page') page: number = 1,
    @Query('size') size: number = 10,
  ): Promise<PaginatedResult<Gdos>> {
    return await this.gdosService.getPaginatedGdos(nombre, page, size);
  }
}
