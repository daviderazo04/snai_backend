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
  ApiCreatedResponse,
  ApiExtraModels,
  ApiOkResponse,
  ApiOperation,
  ApiQuery,
  ApiTags,
  getSchemaPath,
} from '@nestjs/swagger';
import { RepresentanteService } from '../services/representante.service';
import { RepresentantePayloadDto } from '../dto/representante.payload.dto';
import { ResultWithData, SimpleResult } from '../../common/dto/result.dto';
import { PaginatedResult } from '../../common/dto/paginated.result.dto';
import { Representante } from '../entities/representante.entity';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { PermisosGuard } from '../../common/guards/permisos.guard';

@ApiTags('Representante')
@ApiExtraModels(ResultWithData, SimpleResult, PaginatedResult, Representante)
@UseGuards(JwtAuthGuard, PermisosGuard)
@Controller('representantes')
export class RepresentantesController {
  constructor(private readonly representanteService: RepresentanteService) {}

  @Post()
  @ApiOperation({ summary: 'Crear un representante' })
  @ApiBody({ type: RepresentantePayloadDto })
  @ApiCreatedResponse({
    description: 'Representante creado correctamente',
    schema: {
      allOf: [
        { $ref: getSchemaPath(ResultWithData) },
        {
          properties: {
            data: { $ref: getSchemaPath(Representante) },
          },
        },
      ],
    },
  })
  @ApiBadRequestResponse({
    description:
      'El payload no cumple las validaciones o alguna relacion no existe',
  })
  async createRepresentante(
    @Body() payload: RepresentantePayloadDto,
  ): Promise<ResultWithData<Representante>> {
    return this.representanteService.createRepresentante(payload);
  }

  @Get()
  @ApiOperation({ summary: 'Listar representantes paginados' })
  @ApiQuery({ name: 'nombre', required: false, type: String })
  @ApiQuery({ name: 'cedula', required: false, type: String })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'size', required: false, type: Number })
  @ApiOkResponse({
    description: 'Listado paginado de representantes',
    schema: {
      allOf: [
        { $ref: getSchemaPath(PaginatedResult) },
        {
          properties: {
            data: {
              type: 'array',
              items: { $ref: getSchemaPath(Representante) },
            },
          },
        },
      ],
    },
  })
  async getRepresentantes(
    @Query('nombre') nombre: string = '',
    @Query('cedula') cedula: string = '',
    @Query('page') page: number = 1,
    @Query('size') size: number = 10,
  ): Promise<PaginatedResult<Representante>> {
    return this.representanteService.getRepresentantes(
      nombre,
      cedula,
      page,
      size,
    );
  }

  @Patch('/:id')
  @ApiOperation({ summary: 'Actualizar un representante por id' })
  @ApiBody({ type: RepresentantePayloadDto })
  @ApiOkResponse({
    description: 'Representante actualizado correctamente',
    schema: {
      allOf: [
        { $ref: getSchemaPath(ResultWithData) },
        {
          properties: {
            data: { $ref: getSchemaPath(Representante) },
          },
        },
      ],
    },
  })
  @ApiBadRequestResponse({
    description:
      'El payload no cumple las validaciones o alguna relacion no existe',
  })
  async updateRepresentante(
    @Param('id') id: number,
    @Body() payload: RepresentantePayloadDto,
  ): Promise<ResultWithData<Representante>> {
    return this.representanteService.updateRepresentante(id, payload);
  }

  @Delete('/:id')
  @ApiOperation({ summary: 'Eliminar un representante por id' })
  @ApiOkResponse({
    description: 'Resultado de la operacion',
    schema: { $ref: getSchemaPath(SimpleResult) },
  })
  async deleteRepresentante(@Param('id') id: number): Promise<SimpleResult> {
    return this.representanteService.deleteRepresentante(id);
  }
}
