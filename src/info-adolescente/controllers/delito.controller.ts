import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Query,
  UseGuards,
  Put,
  Patch,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiExtraModels,
  ApiOkResponse,
  ApiOperation,
  ApiQuery,
  ApiTags,
  getSchemaPath,
} from '@nestjs/swagger';
import { DelitoService } from '../services/delito.service';
import { DelitoDto } from '../dto/delito.dto';
import { Delito } from '../entities/delito.entity';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { PermisosGuard } from '../../common/guards/permisos.guard';
import { ResultWithData } from '../../common/dto/result.dto';
import { PaginatedResult } from '../../common/dto/paginated.result.dto';
import { Auditar } from '../../auditoria/decorators/auditar.decorator';

@ApiTags('Delito')
@ApiBearerAuth('jwt-auth')
@ApiExtraModels(ResultWithData, PaginatedResult, Delito)
@UseGuards(JwtAuthGuard, PermisosGuard)
@Controller('delito')
export class DelitoController {
  constructor(private readonly delitoService: DelitoService) {}

  @Post()
  @ApiOperation({
    summary: 'Crear un Delito',
    description: 'Crea un nuevo delito en el catálogo.',
  })
  @ApiBody({ type: DelitoDto })
  @ApiCreatedResponse({
    description: 'Delito creado correctamente',
    schema: {
      allOf: [
        { $ref: getSchemaPath(ResultWithData) },
        {
          properties: {
            data: { $ref: getSchemaPath(Delito) },
          },
        },
      ],
    },
  })
  @ApiBadRequestResponse({
    description: 'El payload no cumple las validaciones o el delito ya existe',
  })
  @Auditar(Delito)
  async create(@Body() createDelitoDto: DelitoDto) {
    return await this.delitoService.create(createDelitoDto);
  }

  @Get()
  @ApiOperation({
    summary: 'Listar Delitos paginados',
    description:
      'Devuelve delitos de forma paginada. Permite filtrar por nombre.',
  })
  @ApiQuery({ name: 'nombre', required: false, type: String })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'size', required: false, type: Number })
  @ApiOkResponse({
    description: 'Listado paginado de Delitos',
    schema: {
      allOf: [
        { $ref: getSchemaPath(PaginatedResult) },
        {
          properties: {
            data: {
              type: 'array',
              items: { $ref: getSchemaPath(Delito) },
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
    return await this.delitoService.findAllPaginated(nombre, page, size);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Obtener un Delito por ID',
    description: 'Devuelve la información detallada de un delito específico.',
  })
  @ApiOkResponse({
    description: 'Delito encontrado',
    schema: {
      allOf: [
        { $ref: getSchemaPath(ResultWithData) },
        {
          properties: {
            data: { $ref: getSchemaPath(Delito) },
          },
        },
      ],
    },
  })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return await this.delitoService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Actualizar un Delito',
    description: 'Actualiza los datos de un delito existente.',
  })
  @ApiBody({ type: DelitoDto })
  @ApiOkResponse({
    description: 'Delito actualizado correctamente',
    schema: {
      allOf: [
        { $ref: getSchemaPath(ResultWithData) },
        {
          properties: {
            data: { $ref: getSchemaPath(Delito) },
          },
        },
      ],
    },
  })
  @Auditar(Delito)
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDelitoDto: DelitoDto,
  ) {
    return await this.delitoService.update(id, updateDelitoDto);
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Eliminar un Delito',
    description: 'Elimina un delito del catálogo.',
  })
  @ApiOkResponse({
    description: 'Delito eliminado correctamente',
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
  @Auditar(Delito)
  async remove(@Param('id', ParseIntPipe) id: number) {
    return await this.delitoService.remove(id);
  }
}
