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
import { RepInfractorService } from '../services/repInfractor.service';
import { RepInfractorPayloadDto } from '../dto/repInfractor.payload.dto';
import { ResultWithData, SimpleResult } from '../../common/dto/result.dto';
import { PaginatedResult } from '../../common/dto/paginated.result.dto';
import { RepInfractor } from '../entities/repInfractor.entity';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { PermisosGuard } from '../../common/guards/permisos.guard';

@ApiTags('RepInfractor')
@ApiExtraModels(ResultWithData, SimpleResult, PaginatedResult, RepInfractor)
@UseGuards(JwtAuthGuard, PermisosGuard)
@Controller('rep-infractores')
export class RepInfractoresController {
  constructor(private readonly repInfractorService: RepInfractorService) {}

  @Post()
  @ApiOperation({ summary: 'Crear una relacion representante-adolescente' })
  @ApiBody({ type: RepInfractorPayloadDto })
  @ApiCreatedResponse({
    description: 'Relacion representante-adolescente creada correctamente',
    schema: {
      allOf: [
        { $ref: getSchemaPath(ResultWithData) },
        {
          properties: {
            data: { $ref: getSchemaPath(RepInfractor) },
          },
        },
      ],
    },
  })
  @ApiBadRequestResponse({
    description:
      'El payload no cumple las validaciones o los IDs relacionados no existen',
  })
  async createRepInfractor(
    @Body() payload: RepInfractorPayloadDto,
  ): Promise<ResultWithData<RepInfractor>> {
    return this.repInfractorService.createRepInfractor(payload);
  }

  @Get()
  @ApiOperation({
    summary: 'Listar relaciones representante-adolescente paginadas',
  })
  @ApiQuery({ name: 'adolescenteId', required: false, type: Number })
  @ApiQuery({ name: 'representanteId', required: false, type: Number })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'size', required: false, type: Number })
  @ApiOkResponse({
    description: 'Listado paginado de relaciones representante-adolescente',
    schema: {
      allOf: [
        { $ref: getSchemaPath(PaginatedResult) },
        {
          properties: {
            data: {
              type: 'array',
              items: { $ref: getSchemaPath(RepInfractor) },
            },
          },
        },
      ],
    },
  })
  async getRepInfractores(
    @Query('adolescenteId') adolescenteId?: number,
    @Query('representanteId') representanteId?: number,
    @Query('page') page: number = 1,
    @Query('size') size: number = 10,
  ): Promise<PaginatedResult<RepInfractor>> {
    return this.repInfractorService.getRepInfractores(
      adolescenteId,
      representanteId,
      page,
      size,
    );
  }

  @Patch('/:id')
  @ApiOperation({
    summary: 'Actualizar una relacion representante-adolescente por id',
  })
  @ApiBody({ type: RepInfractorPayloadDto })
  @ApiOkResponse({
    description: 'Relacion representante-adolescente actualizada correctamente',
    schema: {
      allOf: [
        { $ref: getSchemaPath(ResultWithData) },
        {
          properties: {
            data: { $ref: getSchemaPath(RepInfractor) },
          },
        },
      ],
    },
  })
  @ApiBadRequestResponse({
    description:
      'El payload no cumple las validaciones o los IDs relacionados no existen',
  })
  async updateRepInfractor(
    @Param('id') id: number,
    @Body() payload: RepInfractorPayloadDto,
  ): Promise<ResultWithData<RepInfractor>> {
    return this.repInfractorService.updateRepInfractor(id, payload);
  }

  @Delete('/:id')
  @ApiOperation({
    summary: 'Eliminar una relacion representante-adolescente por id',
  })
  @ApiOkResponse({
    description: 'Resultado de la operacion',
    schema: { $ref: getSchemaPath(SimpleResult) },
  })
  async deleteRepInfractor(@Param('id') id: number): Promise<SimpleResult> {
    return this.repInfractorService.deleteRepInfractor(id);
  }
}
