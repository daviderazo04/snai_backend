import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiExtraModels,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiTags,
  getSchemaPath,
} from '@nestjs/swagger';
import { TrasladoService } from '../services/traslado.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { PermisosGuard } from '../../common/guards/permisos.guard';
import {
  TrasladoCreatePayload,
  TrasladoUpdatePayload,
} from '../dto/traslado.payload';
import { ResultWithData } from '../../common/dto/result.dto';
import { Traslado } from '../entities/traslado.entity';
import { PaginatedResult } from '../../common/dto/paginated.result.dto';
import { Auditar } from '../../auditoria/decorators/auditar.decorator';

@ApiTags('Traslados')
@ApiBearerAuth('jwt-auth')
@ApiExtraModels(ResultWithData, PaginatedResult, Traslado)
@UseGuards(JwtAuthGuard, PermisosGuard)
@Controller('traslados')
export class TrasladoController {
  constructor(private readonly trasladoService: TrasladoService) {}

  @Post()
  @ApiOperation({
    summary: 'Crear un traslado',
    description: 'Registra un nuevo traslado de un adolescente a un CAI.',
  })
  @ApiBody({ type: TrasladoCreatePayload })
  @ApiCreatedResponse({
    description: 'Traslado creado correctamente',
    schema: {
      allOf: [
        { $ref: getSchemaPath(ResultWithData) },
        {
          properties: {
            data: { $ref: getSchemaPath(Traslado) },
          },
        },
      ],
    },
  })
  @ApiBadRequestResponse({
    description:
      'El payload no cumple las validaciones o las entidades relacionadas no existen/están inactivas',
  })
  async createTraslado(@Body() payload: TrasladoCreatePayload) {
    return await this.trasladoService.createTraslado(payload);
  }

  @Get()
  @ApiOperation({
    summary: 'Listar traslados paginados',
    description:
      'Devuelve traslados de forma paginada, con opción de filtrar por rango de fechas.',
  })
  @ApiQuery({
    name: 'from',
    required: false,
    type: String,
    format: 'date',
    description: 'Fecha inicial',
  })
  @ApiQuery({
    name: 'to',
    required: false,
    type: String,
    format: 'date',
    description: 'Fecha final',
  })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'size', required: false, type: Number })
  @ApiOkResponse({
    description: 'Listado paginado de traslados',
    schema: {
      allOf: [
        { $ref: getSchemaPath(PaginatedResult) },
        {
          properties: {
            data: {
              type: 'array',
              items: { $ref: getSchemaPath(Traslado) },
            },
          },
        },
      ],
    },
  })
  @Auditar(Traslado)
  async getTraslados(
    @Query('from') from?: string,
    @Query('to') to?: string,
    @Query('adolescenteId') adolescenteId?: number,
    @Query('page')
    page: number = 1,
    @Query('size') size: number = 10,
  ) {
    const fromDate = from ? new Date(from) : null;
    const toDate = to ? new Date(to) : null;
    return await this.trasladoService.getPagiantedTraslados(
      fromDate,
      toDate,
      page,
      size,
    );
  }

  @Patch('/:id')
  @ApiParam({ name: 'id', type: Number, description: 'ID del traslado' })
  @ApiOperation({ summary: 'Actualizar un traslado por id' })
  @ApiBody({ type: TrasladoUpdatePayload })
  @ApiOkResponse({
    description: 'Traslado actualizado correctamente',
    schema: {
      allOf: [
        { $ref: getSchemaPath(ResultWithData) },
        {
          properties: {
            data: { $ref: getSchemaPath(Traslado) },
          },
        },
      ],
    },
  })
  @Auditar(Traslado)
  async updateTraslado(
    @Body() payload: TrasladoUpdatePayload,
    @Param('id') id: number,
  ): Promise<ResultWithData<Traslado>> {
    return await this.trasladoService.updateTraslado(payload, id);
  }

  @Delete('/:id')
  @ApiParam({ name: 'id', type: Number, description: 'ID del traslado' })
  @ApiOperation({
    summary: 'Eliminar un traslado por id (Soft Delete)',
    description: 'Marca un traslado como inactivo por su id',
  })
  @ApiOkResponse({
    description: 'Traslado eliminado exitosamente',
    schema: {
      allOf: [
        { $ref: getSchemaPath(ResultWithData) },
        {
          properties: {
            data: { $ref: getSchemaPath(Traslado) },
          },
        },
      ],
    },
  })
  @Auditar(Traslado)
  async deleteTraslado(
    @Param('id') id: number,
  ): Promise<ResultWithData<Traslado>> {
    return await this.trasladoService.softDeleteTraslado(id);
  }
}
