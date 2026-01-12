import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
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
import { EventoService } from '../services/evento.service';
import { EventoDto } from '../dto/evento.dto';
import { Evento } from '../entities/evento.entity';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { PermisosGuard } from '../../common/guards/permisos.guard';
import { ResultWithData } from '../../common/dto/result.dto';
import { PaginatedResult } from '../../common/dto/paginated.result.dto';
import { Auditar } from '../../auditoria/decorators/auditar.decorator';

@ApiTags('Evento')
@ApiExtraModels(ResultWithData, PaginatedResult, Evento)
@UseGuards(JwtAuthGuard, PermisosGuard)
@Controller('evento')
export class EventoController {
  constructor(private readonly eventoService: EventoService) {}

  @Post()
  @ApiOperation({
    summary: 'Crear un Evento',
    description: 'Crea un nuevo evento en el catálogo.',
  })
  @ApiBody({ type: EventoDto })
  @ApiCreatedResponse({
    description: 'Evento creado correctamente',
    schema: {
      allOf: [
        { $ref: getSchemaPath(ResultWithData) },
        {
          properties: {
            data: { $ref: getSchemaPath(Evento) },
          },
        },
      ],
    },
  })
  @ApiBadRequestResponse({
    description: 'El payload no cumple las validaciones o el evento ya existe',
  })
  @Auditar(Evento)
  async create(@Body() createEventoDto: EventoDto) {
    return await this.eventoService.create(createEventoDto);
  }

  @Get()
  @ApiOperation({
    summary: 'Listar Eventos paginados',
    description:
      'Devuelve eventos de forma paginada. Permite filtrar por nombre del evento.',
  })
  @ApiQuery({ name: 'nombre', required: false, type: String })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'size', required: false, type: Number })
  @ApiOkResponse({
    description: 'Listado paginado de Eventos',
    schema: {
      allOf: [
        { $ref: getSchemaPath(PaginatedResult) },
        {
          properties: {
            data: {
              type: 'array',
              items: { $ref: getSchemaPath(Evento) },
            },
          },
        },
      ],
    },
  })
  async findAll(
    @Query('nombre') nombre: string = '',
    @Query('page') page: number = 1,
    @Query('size') size: number = 10,
  ) {
    // Mapeamos el query param 'nombre' al argumento 'termino' del servicio
    return await this.eventoService.findAllPaginated(nombre, page, size);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Obtener un Evento por ID',
    description: 'Devuelve la información detallada de un evento específico.',
  })
  @ApiOkResponse({
    description: 'Evento encontrado',
    schema: {
      allOf: [
        { $ref: getSchemaPath(ResultWithData) },
        {
          properties: {
            data: { $ref: getSchemaPath(Evento) },
          },
        },
      ],
    },
  })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return await this.eventoService.findOne(id);
  }

  @Put(':id')
  @ApiOperation({
    summary: 'Actualizar un Evento',
    description: 'Actualiza el nombre de un evento existente.',
  })
  @ApiBody({ type: EventoDto })
  @ApiOkResponse({
    description: 'Evento actualizado correctamente',
    schema: {
      allOf: [
        { $ref: getSchemaPath(ResultWithData) },
        {
          properties: {
            data: { $ref: getSchemaPath(Evento) },
          },
        },
      ],
    },
  })
  @Auditar(Evento)
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateEventoDto: EventoDto,
  ) {
    return await this.eventoService.update(id, updateEventoDto);
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Eliminar un Evento',
    description: 'Elimina un evento del catálogo.',
  })
  @ApiOkResponse({
    description: 'Evento eliminado correctamente',
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
  @Auditar(Evento)
  async remove(@Param('id', ParseIntPipe) id: number) {
    return await this.eventoService.remove(id);
  }
}
