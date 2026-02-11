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
  ApiQuery,
  ApiTags,
  getSchemaPath,
} from '@nestjs/swagger';
import { SaludPayloadDto } from '../dto/salud.payload.dto';
import { ResultWithData, SimpleResult } from '../../common/dto/result.dto';
import { Salud } from '../entities/salud.entity';
import { PaginatedResult } from '../../common/dto/paginated.result.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { PermisosGuard } from '../../common/guards/permisos.guard';
import { SaludService } from '../services/salud.service';

@ApiTags('Salud')
@ApiBearerAuth('jwt-auth')
@ApiExtraModels(ResultWithData, SimpleResult, PaginatedResult, Salud)
@UseGuards(JwtAuthGuard, PermisosGuard)
@Controller('salud')
export class SaludController {
  constructor(private readonly saludService: SaludService) {}

  @Post()
  @ApiOperation({ summary: 'Crear un nuevo registro de salud para un adolescente' })
  @ApiBody({ type: SaludPayloadDto })
  @ApiCreatedResponse({
    description: 'Registro creado correctamente',
    schema: {
      allOf: [
        { $ref: getSchemaPath(ResultWithData) },
        { properties: { data: { $ref: getSchemaPath(Salud) } } },
      ],
    },
  })
  @ApiBadRequestResponse({ description: 'Error en el payload o validaciones' })
  async createSalud(
    @Body() payload: SaludPayloadDto,
  ): Promise<ResultWithData<Salud>> {
    return this.saludService.createSalud(payload);
  }

  @Get()
  @ApiOperation({ summary: 'Listar registros de salud paginados' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'size', required: false, type: Number })
  @ApiOkResponse({
    description: 'Listado paginado de registros de salud',
    schema: {
      allOf: [
        { $ref: getSchemaPath(PaginatedResult) },
        {
          properties: {
            data: {
              type: 'array',
              items: { $ref: getSchemaPath(Salud) },
            },
          },
        },
      ],
    },
  })
  async getSalud(
    @Query('page') page: number = 1,
    @Query('size') size: number = 10,
  ): Promise<PaginatedResult<Salud>> {
    return this.saludService.getSaludPaginado(page, size);
  }

  @Patch('/:id')
  @ApiOperation({ summary: 'Actualizar registro de salud por id' })
  @ApiBody({ type: SaludPayloadDto })
  @ApiOkResponse({
    description: 'Registro actualizado correctamente',
    schema: {
      allOf: [
        { $ref: getSchemaPath(ResultWithData) },
        { properties: { data: { $ref: getSchemaPath(Salud) } } },
      ],
    },
  })
  async updateSalud(
    @Param('id') id: number,
    @Body() payload: SaludPayloadDto,
  ): Promise<ResultWithData<Salud>> {
    return this.saludService.updateSalud(id, payload);
  }

  @Delete('/:id')
  @ApiOperation({ summary: 'Borrado lógico de un registro de salud' })
  @ApiOkResponse({
    description: 'Resultado de la operación',
    schema: { $ref: getSchemaPath(SimpleResult) },
  })
  async deleteSalud(@Param('id') id: number): Promise<SimpleResult> {
    return this.saludService.softDeleteSalud(id);
  }
}
