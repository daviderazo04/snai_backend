import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
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
import { CantonPayload } from '../dto/canton.payload.dto';
import { ResultWithData, SimpleResult } from '../../common/dto/result.dto';
import { Canton } from '../entities/canton.entity';
import { PaginatedResult } from '../../common/dto/paginated.result.dto';
import { CantonService } from '../services/canton.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { PermisosGuard } from '../../common/guards/permisos.guard';
import { Auditar } from '../../auditoria/decorators/auditar.decorator';
import { Cai } from '../entities/cai.entity';
import { PutLocalidadesDto } from '../dto/put.localidades.dto';

@ApiTags('Cantones')
@ApiBearerAuth('jwt-auth')
@ApiExtraModels(ResultWithData, PaginatedResult, Canton)
@UseGuards(JwtAuthGuard, PermisosGuard)
@Controller('cantones')
export class CantonesController {
  constructor(private readonly cantonService: CantonService) {}

  @Post()
  @ApiOperation({ summary: 'Crear un cantón asociado a una provincia' })
  @ApiBody({ type: CantonPayload })
  @ApiCreatedResponse({
    description: 'Cantón creado correctamente',
    schema: {
      allOf: [
        { $ref: getSchemaPath(ResultWithData) },
        {
          properties: {
            data: { $ref: getSchemaPath(Canton) },
          },
        },
      ],
    },
  })
  @ApiBadRequestResponse({
    description:
      'El payload no cumple las validaciones o la provincia indicada no existe',
  })
  async createCanton(
    @Body() payload: CantonPayload,
  ): Promise<ResultWithData<Canton>> {
    return this.cantonService.createCanton(payload);
  }

  @Get()
  @ApiOperation({ summary: 'Listar cantones paginados' })
  @ApiQuery({ name: 'nombre', required: false, type: String })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'size', required: false, type: Number })
  @ApiOkResponse({
    description: 'Listado paginado de cantones',
    schema: {
      allOf: [
        { $ref: getSchemaPath(PaginatedResult) },
        {
          properties: {
            data: {
              type: 'array',
              items: { $ref: getSchemaPath(Canton) },
            },
          },
        },
      ],
    },
  })
  async getCantones(
    @Query('nombre') nombre: string = '',
    @Query('page') page: number = 1,
    @Query('size') size: number = 10,
  ): Promise<PaginatedResult<Canton>> {
    return this.cantonService.getPaginatedCanton(nombre, page, size);
  }

  @Delete('/:id')
  @ApiParam({ name: 'id', type: Number, description: 'ID del cantón' })
  @ApiOkResponse({
    description: 'Resultado de la operacion',
    schema: { $ref: getSchemaPath(SimpleResult) },
  })
  @ApiOperation({
    summary: 'Eliminar un Canton por id',
    description: 'Elimina un Canton por su id',
  })
  @Auditar(Canton)
  async deleteCanton(@Param('id') id: number): Promise<SimpleResult> {
    return await this.cantonService.softDeleteCaton(id);
  }

  @Patch('/:id')
  @ApiParam({ name: 'id', type: Number, description: 'ID del cantón' })
  @ApiOperation({ summary: 'Actualizar un canton por id' })
  @ApiBody({ type: PutLocalidadesDto })
  @ApiOkResponse({
    description: 'Canton actualizado correctamente',
    schema: {
      allOf: [
        { $ref: getSchemaPath(ResultWithData) },
        {
          properties: {
            data: { $ref: getSchemaPath(Canton) },
          },
        },
      ],
    },
  })
  @Auditar(Canton)
  async updateCanton(
    @Body() payload: PutLocalidadesDto,
    @Param('id') id: number,
  ): Promise<ResultWithData<Canton>> {
    return await this.cantonService.editCanton(id, payload);
  }
}
