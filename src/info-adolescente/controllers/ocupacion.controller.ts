import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Put,
  Post,
  Query,
  UseGuards,
  // Delete,
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
import { OcupacionService } from '../services/ocupacion.service';
import { CreateOcupacionDto } from '../dto/ocupacion.dto';
import { Ocupacion } from '../entities/ocupacion.entity';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { PermisosGuard } from '../../common/guards/permisos.guard';
import { ResultWithData } from '../../common/dto/result.dto';
import { PaginatedResult } from '../../common/dto/paginated.result.dto';
import { Auditar } from '../../auditoria/decorators/auditar.decorator';

@ApiTags('Ocupación')
@ApiExtraModels(ResultWithData, PaginatedResult, Ocupacion)
@UseGuards(JwtAuthGuard, PermisosGuard)
@Controller('ocupacion')
export class OcupacionController {
  constructor(private readonly ocupacionService: OcupacionService) {}

  @Post()
  @ApiOperation({
    summary: 'Crear un registro de Ocupación',
    description: 'Crea una nueva actividad o taller asociado a un adolescente.',
  })
  @ApiBody({ type: CreateOcupacionDto })
  @ApiCreatedResponse({
    description: 'Registro de ocupación creado correctamente',
    schema: {
      allOf: [
        { $ref: getSchemaPath(ResultWithData) },
        {
          properties: {
            data: { $ref: getSchemaPath(Ocupacion) },
          },
        },
      ],
    },
  })
  @ApiBadRequestResponse({
    description:
      'El payload no cumple las validaciones o el adolescente no existe',
  })
  @Auditar(Ocupacion)
  async create(@Body() createOcupacionDto: CreateOcupacionDto) {
    return await this.ocupacionService.create(createOcupacionDto);
  }

  @Get()
  @ApiOperation({
    summary: 'Listar registros de Ocupación paginados',
    description:
      'Devuelve el listado de talleres/ocupaciones. Permite filtrar por nombre del taller o por ID del adolescente.',
  })
  @ApiQuery({
    name: 'termino',
    required: false,
    type: String,
    description: 'Búsqueda por nombre del taller',
  })
  @ApiQuery({
    name: 'adolescenteId',
    required: false,
    type: Number,
    description: 'Filtrar por ID de adolescente',
  })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'size', required: false, type: Number })
  @ApiOkResponse({
    description: 'Listado paginado de ocupaciones',
    schema: {
      allOf: [
        { $ref: getSchemaPath(PaginatedResult) },
        {
          properties: {
            data: {
              type: 'array',
              items: { $ref: getSchemaPath(Ocupacion) },
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
  ) {
    return await this.ocupacionService.findAllPaginated(
      termino,
      page,
      size,
      adolescenteId,
    );
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Obtener una Ocupación por ID',
    description:
      'Devuelve la información detallada de una ocupación específica.',
  })
  @ApiOkResponse({
    description: 'Registro de ocupación encontrado',
    schema: {
      allOf: [
        { $ref: getSchemaPath(ResultWithData) },
        {
          properties: {
            data: { $ref: getSchemaPath(Ocupacion) },
          },
        },
      ],
    },
  })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return await this.ocupacionService.findOne(id);
  }

  @Put(':id')
  @ApiOperation({
    summary: 'Actualizar una Ocupación',
    description: 'Actualiza los datos de una ocupación existente.',
  })
  @ApiBody({ type: CreateOcupacionDto })
  @ApiOkResponse({
    description: 'Registro de ocupación actualizado correctamente',
    schema: {
      allOf: [
        { $ref: getSchemaPath(ResultWithData) },
        {
          properties: {
            data: { $ref: getSchemaPath(Ocupacion) },
          },
        },
      ],
    },
  })
  @Auditar(Ocupacion)
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateOcupacionDto: CreateOcupacionDto, // Usamos el mismo DTO como base
  ) {
    return await this.ocupacionService.update(id, updateOcupacionDto);
  }

  /*
  @Delete(':id')
  @ApiOperation({
    summary: 'Eliminar una Ocupación',
    description: 'Elimina un registro de ocupación del sistema.',
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
  async remove(@Param('id', ParseIntPipe) id: number) {
    return await this.ocupacionService.remove(id);
  }
  */
}
