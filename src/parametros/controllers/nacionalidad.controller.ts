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
import { NacionalidadService } from '../services/nacionalidad.service';
import { ParamPayload } from '../dto/param.payload';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { PermisosGuard } from '../../common/guards/permisos.guard';
import { ResultWithData, SimpleResult } from '../../common/dto/result.dto';
import { PaginatedResult } from '../../common/dto/paginated.result.dto';
import { Nacionalidad } from '../entities/nacionalidad.entity';
import { Auditar } from '../../auditoria/decorators/auditar.decorator';
import { Gdos } from '../entities/gdos';

@ApiTags('Nacionalidad')
@ApiExtraModels(ResultWithData, PaginatedResult, Nacionalidad)
@UseGuards(JwtAuthGuard, PermisosGuard)
@Controller('nacionalidad')
export class NacionalidadController {
  constructor(private readonly nacionalidadService: NacionalidadService) {}
  @Post()
  @ApiOperation({ summary: 'Crear una nacionalidad' })
  @ApiBody({ type: ParamPayload })
  @ApiCreatedResponse({
    description: 'Nacionalidad creada correctamente',
    schema: {
      allOf: [
        { $ref: getSchemaPath(ResultWithData) },
        {
          properties: {
            data: { $ref: getSchemaPath(Nacionalidad) },
          },
        },
      ],
    },
  })
  @ApiBadRequestResponse({
    description:
      'El payload no cumple las validaciones o no se pudo crear la nacionalidad',
  })
  async createNacionalidad(
    @Body() payload: ParamPayload,
  ): Promise<ResultWithData<Nacionalidad>> {
    return await this.nacionalidadService.createNacionalidad(payload);
  }
  @Get()
  @ApiOperation({
    summary: 'Listar nacionalidades de forma paginada',
  })
  @ApiQuery({ name: 'nombre', required: false, type: String })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'size', required: false, type: Number })
  @ApiOkResponse({
    description: 'Listado paginado de nacionalidades',
    schema: {
      allOf: [
        { $ref: getSchemaPath(PaginatedResult) },
        {
          properties: {
            data: {
              type: 'array',
              items: { $ref: getSchemaPath(Nacionalidad) },
            },
          },
        },
      ],
    },
  })
  async getNacionalidad(
    @Query('nombre') nombre: string = '',
    @Query('page') page: number = 1,
    @Query('size') size: number = 10,
  ): Promise<PaginatedResult<Nacionalidad>> {
    return await this.nacionalidadService.getPaginatedNacionalidad(
      nombre,
      page,
      size,
    );
  }

  @Delete('/:id')
  @ApiOperation({
    summary: 'Eliminar una nacionalidad',
  })
  @ApiOkResponse({
    description: 'Nacionalidad eliminada correctamente',
    schema: { $ref: getSchemaPath(SimpleResult) },
  })
  @Auditar(Nacionalidad)
  async deleteNacionalidad(@Param('id') id: number): Promise<SimpleResult> {
    return await this.nacionalidadService.softDeleteNacionalidad(id);
  }
  @Patch('/:id')
  @ApiOperation({
    summary: 'Editar una nacionalidad',
  })
  @ApiOkResponse({
    description: 'Nacionalidad editada correctamente',
    schema: {
      $ref: getSchemaPath(ResultWithData),
      properties: { data: { $ref: getSchemaPath(Nacionalidad) } },
    },
  })
  @Auditar(Nacionalidad)
  async updateGdo(
    @Param('id') id: number,
    @Body() payload: ParamPayload,
  ): Promise<SimpleResult> {
    return await this.nacionalidadService.editNacionalidad(id, payload);
  }
}
