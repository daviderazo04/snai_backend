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
import { EstadoCivilService } from '../services/estadoCivil.service';
import { ParamPayload } from '../dto/param.payload';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { PermisosGuard } from '../../common/guards/permisos.guard';
import { ResultWithData } from '../../common/dto/result.dto';
import { EstadoCivil } from '../entities/estadoCivil';
import { PaginatedResult } from '../../common/dto/paginated.result.dto';

@ApiTags('Estado civil')
@ApiExtraModels(ResultWithData, PaginatedResult, EstadoCivil)
@UseGuards(JwtAuthGuard, PermisosGuard)
@Controller('estado-civil')
export class EstadoCivilController {
  constructor(private readonly estadoCivilService: EstadoCivilService) {}
  @Post()
  @ApiOperation({ summary: 'Crear un estado civil' })
  @ApiBody({ type: ParamPayload })
  @ApiCreatedResponse({
    description: 'Estado civil creado correctamente',
    schema: {
      allOf: [
        { $ref: getSchemaPath(ResultWithData) },
        {
          properties: {
            data: { $ref: getSchemaPath(EstadoCivil) },
          },
        },
      ],
    },
  })
  @ApiBadRequestResponse({
    description:
      'El payload no cumple las validaciones o no se pudo crear el estado civil',
  })
  async createEstadoCivil(
    @Body() payload: ParamPayload,
  ): Promise<ResultWithData<EstadoCivil>> {
    return await this.estadoCivilService.createEstadoCivil(payload);
  }
  @Get()
  @ApiOperation({
    summary: 'Listar estados civiles de forma paginada',
  })
  @ApiQuery({ name: 'nombre', required: false, type: String })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'size', required: false, type: Number })
  @ApiOkResponse({
    description: 'Listado paginado de estados civiles',
    schema: {
      allOf: [
        { $ref: getSchemaPath(PaginatedResult) },
        {
          properties: {
            data: {
              type: 'array',
              items: { $ref: getSchemaPath(EstadoCivil) },
            },
          },
        },
      ],
    },
  })
  async getEstadoCivil(
    @Query('nombre') nombre: string = '',
    @Query('page') page: number = 1,
    @Query('size') size: number = 10,
  ): Promise<PaginatedResult<EstadoCivil>> {
    return await this.estadoCivilService.getPaginatedEstadoCivil(
      nombre,
      page,
      size,
    );
  }
}
