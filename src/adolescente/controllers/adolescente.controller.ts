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
import { AdolescentePayloadDto } from '../dto/adolescente.payload.dto';
import { ResultWithData, SimpleResult } from '../../common/dto/result.dto';
import { Adolescente } from '../entities/adolescente.entity';
import { PaginatedResult } from '../../common/dto/paginated.result.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { PermisosGuard } from '../../common/guards/permisos.guard';
import { AdolescenteService } from '../services/adolescente.service';

@ApiTags('Adolescentes')
@ApiBearerAuth('jwt-auth')
@ApiExtraModels(ResultWithData, SimpleResult, PaginatedResult, Adolescente)
@UseGuards(JwtAuthGuard, PermisosGuard)
@Controller('adolescentes')
export class AdolescentesController {
  constructor(private readonly adolescenteService: AdolescenteService) {}

  @Post()
  @ApiOperation({ summary: 'Crear un nuevo adolescente' })
  @ApiBody({ type: AdolescentePayloadDto })
  @ApiCreatedResponse({
    description: 'Adolescente creado correctamente',
    schema: {
      allOf: [
        { $ref: getSchemaPath(ResultWithData) },
        {
          properties: {
            data: { $ref: getSchemaPath(Adolescente) },
          },
        },
      ],
    },
  })
  @ApiBadRequestResponse({
    description:
      'El payload no cumple las validaciones o algún campo de adolescente no está bien especificado',
  })
  async createAdolescente(
    @Body() payload: AdolescentePayloadDto,
  ): Promise<ResultWithData<Adolescente>> {
    return this.adolescenteService.createAdolescente(payload);
  }
  @Get('/:id')
  @ApiOperation({ summary: 'Obtener un adolescente por id' })
  @ApiParam({ name: 'id', type: Number, description: 'ID del adolescente' })
  @ApiOkResponse({
    description: 'Adolescente encontrado',
    schema: {
      allOf: [
        { $ref: getSchemaPath(ResultWithData) },
        { properties: { data: { $ref: getSchemaPath(Adolescente) } } },
      ],
    },
  })
  async getAdolcenteById(
    @Param('id') id: number,
  ): Promise<ResultWithData<Adolescente>> {
    return this.adolescenteService.getAdolcenteById(id);
  }
  @Get()
  @ApiOperation({ summary: 'Listar adolescentes paginados' })
  @ApiQuery({ name: 'nombre', required: false, type: String })
  @ApiQuery({ name: 'cedula', required: false, type: String })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'size', required: false, type: Number })
  @ApiOkResponse({
    description: 'Listado paginado de adolescentes',
    schema: {
      allOf: [
        { $ref: getSchemaPath(PaginatedResult) },
        {
          properties: {
            data: {
              type: 'array',
              items: { $ref: getSchemaPath(Adolescente) },
            },
          },
        },
      ],
    },
  })
  async getAdolescentes(
    @Query('nombre') nombre: string = '',
    @Query('cedula') cedula: string = '',
    @Query('page') page: number = 1,
    @Query('size') size: number = 10,
  ): Promise<PaginatedResult<Adolescente>> {
    return this.adolescenteService.getAdolescentes(nombre, cedula, page, size);
  }

  @Patch('/:id')
  @ApiOperation({ summary: 'Actualizar un adolescente por id' })
  @ApiBody({ type: AdolescentePayloadDto })
  @ApiOkResponse({
    description: 'Adolescente actualizado correctamente',
    schema: {
      allOf: [
        { $ref: getSchemaPath(ResultWithData) },
        {
          properties: {
            data: { $ref: getSchemaPath(Adolescente) },
          },
        },
      ],
    },
  })
  @ApiBadRequestResponse({
    description:
      'El payload no cumple las validaciones o algún campo de adolescente no está bien especificado',
  })
  async updateAdolescente(
    @Param('id') id: number,
    @Body() payload: AdolescentePayloadDto,
  ): Promise<ResultWithData<Adolescente>> {
    return this.adolescenteService.updateAdolescente(id, payload);
  }

  @Delete('/:id')
  @ApiOperation({ summary: 'Eliminar un adolescente por id' })
  @ApiOkResponse({
    description: 'Resultado de la operacion',
    schema: { $ref: getSchemaPath(SimpleResult) },
  })
  async deleteAdolescente(@Param('id') id: number): Promise<SimpleResult> {
    return this.adolescenteService.softDeleteAdolescente(id);
  }
}
