import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Put,
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
import { FamiliaService } from '../services/familia.service';
import { FamiliaDto } from '../dto/familia.dto';
import { Familia } from '../entities/familia.entity';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { PermisosGuard } from '../../common/guards/permisos.guard';
import { ResultWithData } from '../../common/dto/result.dto';
import { PaginatedResult } from '../../common/dto/paginated.result.dto';
import { Auditar } from '../../auditoria/decorators/auditar.decorator';

@ApiTags('Familia')
@ApiExtraModels(ResultWithData, PaginatedResult, Familia)
@UseGuards(JwtAuthGuard, PermisosGuard)
@Controller('familia')
export class FamiliaController {
  constructor(private readonly familiaService: FamiliaService) {}

  @Post()
  @ApiOperation({
    summary: 'Crear un registro de Familia',
    description:
      'Crea un nuevo registro de interacción familiar asociado a un adolescente y un evento.',
  })
  @ApiBody({ type: FamiliaDto })
  @ApiCreatedResponse({
    description: 'Registro familiar creado correctamente',
    schema: {
      allOf: [
        { $ref: getSchemaPath(ResultWithData) },
        {
          properties: {
            data: { $ref: getSchemaPath(Familia) },
          },
        },
      ],
    },
  })
  @ApiBadRequestResponse({
    description:
      'El payload no cumple las validaciones o los IDs relacionados no existen',
  })
  @Auditar(Familia)
  async create(@Body() createFamiliaDto: FamiliaDto) {
    return await this.familiaService.create(createFamiliaDto);
  }

  @Get()
  @ApiOperation({
    summary: 'Listar registros de Familia paginados',
    description:
      'Devuelve interacciones familiares con filtros opcionales por detalle, adolescente o evento.',
  })
  @ApiQuery({
    name: 'termino',
    required: false,
    type: String,
    description: 'Búsqueda por detalle de la interacción',
  })
  @ApiQuery({
    name: 'adolescenteId',
    required: false,
    type: Number,
    description: 'Filtrar por ID de adolescente',
  })
  @ApiQuery({
    name: 'eventoId',
    required: false,
    type: Number,
    description: 'Filtrar por ID de evento',
  })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'size', required: false, type: Number })
  @ApiOkResponse({
    description: 'Listado paginado de registros familiares',
    schema: {
      allOf: [
        { $ref: getSchemaPath(PaginatedResult) },
        {
          properties: {
            data: {
              type: 'array',
              items: { $ref: getSchemaPath(Familia) },
            },
          },
        },
      ],
    },
  })
  async findAll(
    @Query('termino') termino: string = '',
    @Query('page') page: number = 1,
    @Query('size') size: number = 10,
    @Query('adolescenteId') adolescenteId?: number,
    @Query('eventoId') eventoId?: number,
  ) {
    return await this.familiaService.findAllPaginated(
      termino,
      page,
      size,
      adolescenteId,
      eventoId,
    );
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Obtener un registro de Familia por ID',
    description:
      'Devuelve la información detallada de una interacción familiar específica.',
  })
  @ApiOkResponse({
    description: 'Registro familiar encontrado',
    schema: {
      allOf: [
        { $ref: getSchemaPath(ResultWithData) },
        {
          properties: {
            data: { $ref: getSchemaPath(Familia) },
          },
        },
      ],
    },
  })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return await this.familiaService.findOne(id);
  }

  @Put(':id')
  @ApiOperation({
    summary: 'Actualizar un registro de Familia',
    description: 'Actualiza los datos de una interacción familiar existente.',
  })
  @ApiBody({ type: FamiliaDto })
  @ApiOkResponse({
    description: 'Registro familiar actualizado correctamente',
    schema: {
      allOf: [
        { $ref: getSchemaPath(ResultWithData) },
        {
          properties: {
            data: { $ref: getSchemaPath(Familia) },
          },
        },
      ],
    },
  })
  @Auditar(Familia)
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateFamiliaDto: FamiliaDto, // Usamos el mismo DTO
  ) {
    return await this.familiaService.update(id, updateFamiliaDto);
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Eliminar un registro de Familia',
    description: 'Elimina una interacción familiar del sistema.',
  })
  @ApiOkResponse({
    description: 'Registro eliminado correctamente',
    schema: {
      allOf: [
        { $ref: getSchemaPath(ResultWithData) },
        {
          properties: {
            data: { type: 'boolean' },
          },
        },
      ],
    },
  })
  @Auditar(Familia)
  async remove(@Param('id', ParseIntPipe) id: number) {
    return await this.familiaService.remove(id);
  }
}
