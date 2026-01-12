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
  Req,
  Request,
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
import { ProvinciaPayloadDto } from '../dto/provincia.payload.dto';
import { ProvinciaService } from '../services/provincia.service';
import { ResultWithData, SimpleResult } from '../../common/dto/result.dto';
import { Provincia } from '../entities/provincia.entity';
import { PaginatedResult } from '../../common/dto/paginated.result.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { PermisosGuard } from '../../common/guards/permisos.guard';
import * as AuditedRequest from '../../common/request/AuditedRequest';
import { ProvinciaUpdatePayloadDto } from '../dto/provincia.update.payload.dto';
import { AuditoriaService } from '../../auditoria/auditoria.service';
import { Auditar } from '../../auditoria/decorators/auditar.decorator';
import { Canton } from '../entities/canton.entity';
import { PutLocalidadesDto } from '../dto/put.localidades.dto';

@ApiTags('Provincias')
@ApiExtraModels(ResultWithData, PaginatedResult, Provincia)
@UseGuards(JwtAuthGuard, PermisosGuard)
@Controller('provincias')
export class ProvinciasController {
  constructor(
    private readonly provinciaService: ProvinciaService,
    private readonly auditoriaService: AuditoriaService,
  ) {}
  @Auditar(Provincia)
  @Post()
  @ApiOperation({ summary: 'Crear una nueva provincia' })
  @ApiBody({ type: ProvinciaPayloadDto })
  @ApiCreatedResponse({
    description: 'Provincia creada correctamente',
    schema: {
      allOf: [
        { $ref: getSchemaPath(ResultWithData) },
        {
          properties: {
            data: { $ref: getSchemaPath(Provincia) },
          },
        },
      ],
    },
  })
  @ApiBadRequestResponse({
    description:
      'El payload no cumple las validaciones o no se pudo crear la provincia',
  })
  async createProvincia(
    @Body() provincia: ProvinciaPayloadDto,
  ): Promise<ResultWithData<Provincia>> {
    return this.provinciaService.createProvincia(provincia);
  }

  @Get()
  @ApiOperation({
    summary: 'Listar provincias con sus cantones de forma paginada',
  })
  @ApiQuery({ name: 'nombre', required: false, type: String })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'size', required: false, type: Number })
  @ApiOkResponse({
    description: 'Listado paginado de provincias con sus cantones',
    schema: {
      allOf: [
        { $ref: getSchemaPath(PaginatedResult) },
        {
          properties: {
            data: {
              type: 'array',
              items: { $ref: getSchemaPath(Provincia) },
            },
          },
        },
      ],
    },
  })
  async getProvincias(
    @Query('nombre') nombre: string = '',
    @Query('page') page: number = 1,
    @Query('size') size: number = 10,
  ): Promise<PaginatedResult<Provincia>> {
    return this.provinciaService.getPaginatedProvincia(nombre, page, size);
  }

  @Delete('/:id')
  @ApiOkResponse({
    description: 'Resultado de la operacion',
    schema: { $ref: getSchemaPath(SimpleResult) },
  })
  @ApiOperation({
    summary: 'Eliminar un Canton por id',
    description: 'Elimina un Canton por su id',
  })
  async deleteProvincia(@Query('id') id: number): Promise<SimpleResult> {
    return await this.provinciaService.softDeleteProvincia(id);
  }
  @Auditar(Provincia)
  @Patch('/:id')
  @ApiOperation({ summary: 'Actualizar un canton por id' })
  @ApiBody({ type: PutLocalidadesDto })
  @ApiOkResponse({
    description: 'Provincia actualizado correctamente',
    schema: {
      allOf: [
        { $ref: getSchemaPath(ResultWithData) },
        {
          properties: {
            data: { $ref: getSchemaPath(Provincia) },
          },
        },
      ],
    },
  })
  @Auditar(Provincia)
  async updateProvincia(
    @Body() payload: PutLocalidadesDto,
    @Param('id') id: number,
  ): Promise<ResultWithData<Provincia>> {
    return await this.provinciaService.editProvincia(id, payload);
  }
}
