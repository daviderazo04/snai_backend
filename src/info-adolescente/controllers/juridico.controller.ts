import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UseGuards,
  // Delete, // Comentado según servicio
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
import { JuridicoService } from '../services/juridico.service';
import { CreateJuridicoDto } from '../dto/juridico.dto';
import { Juridico } from '../entities/juridico.entity';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { PermisosGuard } from '../../common/guards/permisos.guard';
import { ResultWithData } from '../../common/dto/result.dto';
import { PaginatedResult } from '../../common/dto/paginated.result.dto';

@ApiTags('Jurídico')
@ApiExtraModels(ResultWithData, PaginatedResult, Juridico)
@UseGuards(JwtAuthGuard, PermisosGuard)
@Controller('juridico')
export class JuridicoController {
  constructor(private readonly juridicoService: JuridicoService) {}

  @Post()
  @ApiOperation({
    summary: 'Crear un registro Jurídico',
    description:
      'Crea un nuevo historial jurídico asociado a un adolescente y un delito.',
  })
  @ApiBody({ type: CreateJuridicoDto })
  @ApiCreatedResponse({
    description: 'Registro jurídico creado correctamente',
    schema: {
      allOf: [
        { $ref: getSchemaPath(ResultWithData) },
        {
          properties: {
            data: { $ref: getSchemaPath(Juridico) },
          },
        },
      ],
    },
  })
  @ApiBadRequestResponse({
    description:
      'El payload no cumple las validaciones o los IDs relacionados no existen',
  })
  async create(@Body() createJuridicoDto: CreateJuridicoDto) {
    return await this.juridicoService.create(createJuridicoDto);
  }

  @Get()
  @ApiOperation({
    summary: 'Listar registros Jurídicos paginados',
    description:
      'Devuelve registros jurídicos con filtros opcionales por causa, adolescente o delito.',
  })
  @ApiQuery({
    name: 'termino',
    required: false,
    type: String,
    description: 'Búsqueda por número de causa',
  })
  @ApiQuery({
    name: 'adolescenteId',
    required: false,
    type: Number,
    description: 'Filtrar por ID de adolescente',
  })
  @ApiQuery({
    name: 'delitoId',
    required: false,
    type: Number,
    description: 'Filtrar por ID de delito',
  })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'size', required: false, type: Number })
  @ApiOkResponse({
    description: 'Listado paginado de registros jurídicos',
    schema: {
      allOf: [
        { $ref: getSchemaPath(PaginatedResult) },
        {
          properties: {
            data: {
              type: 'array',
              items: { $ref: getSchemaPath(Juridico) },
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
    @Query('delitoId') delitoId?: number,
  ) {
    return await this.juridicoService.findAllPaginated(
      termino,
      page,
      size,
      adolescenteId,
      delitoId,
    );
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Obtener un registro Jurídico por ID',
    description:
      'Devuelve la información detallada de un proceso jurídico específico.',
  })
  @ApiOkResponse({
    description: 'Registro jurídico encontrado',
    schema: {
      allOf: [
        { $ref: getSchemaPath(ResultWithData) },
        {
          properties: {
            data: { $ref: getSchemaPath(Juridico) },
          },
        },
      ],
    },
  })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return await this.juridicoService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Actualizar un registro Jurídico',
    description: 'Actualiza los datos de un proceso jurídico existente.',
  })
  @ApiBody({ type: CreateJuridicoDto })
  @ApiOkResponse({
    description: 'Registro jurídico actualizado correctamente',
    schema: {
      allOf: [
        { $ref: getSchemaPath(ResultWithData) },
        {
          properties: {
            data: { $ref: getSchemaPath(Juridico) },
          },
        },
      ],
    },
  })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateJuridicoDto: CreateJuridicoDto, // Usamos el mismo DTO como base
  ) {
    return await this.juridicoService.update(id, updateJuridicoDto);
  }

  /*
  @Delete(':id')
  @ApiOperation({
    summary: 'Eliminar un registro Jurídico',
    description: 'Elimina un proceso jurídico del sistema.',
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
    return await this.juridicoService.remove(id);
  }
  */
}
