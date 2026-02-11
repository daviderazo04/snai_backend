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
import { GdosService } from '../services/gdos.service';
import { ParamPayload } from '../dto/param.payload';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { PermisosGuard } from '../../common/guards/permisos.guard';
import { ResultWithData, SimpleResult } from '../../common/dto/result.dto';
import { PaginatedResult } from '../../common/dto/paginated.result.dto';
import { Gdos } from '../entities/gdos';
import { Auditar } from '../../auditoria/decorators/auditar.decorator';
import { Etnia } from '../entities/etnia.entity';

@ApiTags('Gdos')
@ApiBearerAuth('jwt-auth')
@ApiExtraModels(ResultWithData, PaginatedResult, Gdos)
@UseGuards(JwtAuthGuard, PermisosGuard)
@Controller('gdos')
export class GdosController {
  constructor(private readonly gdosService: GdosService) {}
  @Post()
  @ApiOperation({ summary: 'Crear un grado' })
  @ApiBody({ type: ParamPayload })
  @ApiCreatedResponse({
    description: 'Gdos creado correctamente',
    schema: {
      allOf: [
        { $ref: getSchemaPath(ResultWithData) },
        {
          properties: {
            data: { $ref: getSchemaPath(Gdos) },
          },
        },
      ],
    },
  })
  @ApiBadRequestResponse({
    description:
      'El payload no cumple las validaciones o no se pudo crear el grado',
  })
  async createGdos(
    @Body() payload: ParamPayload,
  ): Promise<ResultWithData<Gdos>> {
    return await this.gdosService.createGdos(payload);
  }
  @Get()
  @ApiOperation({
    summary: 'Listar grados de forma paginada',
  })
  @ApiQuery({ name: 'nombre', required: false, type: String })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'size', required: false, type: Number })
  @ApiOkResponse({
    description: 'Listado paginado de grados',
    schema: {
      allOf: [
        { $ref: getSchemaPath(PaginatedResult) },
        {
          properties: {
            data: {
              type: 'array',
              items: { $ref: getSchemaPath(Gdos) },
            },
          },
        },
      ],
    },
  })
  async getGdos(
    @Query('nombre') nombre: string = '',
    @Query('page') page: number = 1,
    @Query('size') size: number = 10,
  ): Promise<PaginatedResult<Gdos>> {
    return await this.gdosService.getPaginatedGdos(nombre, page, size);
  }

  @Delete('/:id')
  @ApiParam({ name: 'id', type: Number, description: 'ID del grado' })
  @ApiOperation({
    summary: 'Eliminar un  GDO',
  })
  @ApiOkResponse({
    description: 'GDO eliminado correctamente',
    schema: { $ref: getSchemaPath(SimpleResult) },
  })
  @Auditar(Gdos)
  async deleteGdo(@Param('id') id: number): Promise<SimpleResult> {
    return await this.gdosService.softDeleteGdos(id);
  }
  @Patch('/:id')
  @ApiParam({ name: 'id', type: Number, description: 'ID del grado' })
  @ApiOperation({
    summary: 'Editar un gdo',
  })
  @ApiOkResponse({
    description: 'Gdo editado correctamente',
    schema: {
      $ref: getSchemaPath(ResultWithData),
      properties: { data: { $ref: getSchemaPath(Gdos) } },
    },
  })
  @Auditar(Gdos)
  async updateGdo(
    @Param('id') id: number,
    @Body() payload: ParamPayload,
  ): Promise<SimpleResult> {
    return await this.gdosService.editGdos(id, payload);
  }
}
