import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
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
import { EducaPayloadDto } from '../dto/educa.payload.dto';
import { ResultWithData, SimpleResult } from '../../common/dto/result.dto';
import { Educa } from '../entities/educa.entity';
import { PaginatedResult } from '../../common/dto/paginated.result.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { PermisosGuard } from '../../common/guards/permisos.guard';
import { EducaService } from '../services/educa.service';

@ApiTags('Educación')
@ApiExtraModels(ResultWithData, SimpleResult, PaginatedResult, Educa)
@UseGuards(JwtAuthGuard, PermisosGuard)
@Controller('educacion')
export class EducaController {
  constructor(private readonly educaService: EducaService) {}

  @Post()
  @ApiOperation({ summary: 'Crear un nuevo registro educativo' })
  @ApiBody({ type: EducaPayloadDto })
  @ApiCreatedResponse({
    description: 'Registro educativo creado correctamente',
    schema: {
      allOf: [
        { $ref: getSchemaPath(ResultWithData) },
        { properties: { data: { $ref: getSchemaPath(Educa) } } },
      ],
    },
  })
  @ApiBadRequestResponse({ description: 'Error en validaciones' })
  async createEduca(
    @Body() payload: EducaPayloadDto,
  ): Promise<ResultWithData<Educa>> {
    return this.educaService.createEduca(payload);
  }

  @Get()
  @ApiOperation({ summary: 'Listar registros educativos paginados' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'size', required: false, type: Number })
  @ApiOkResponse({
    description: 'Listado paginado de educación',
    schema: {
      allOf: [
        { $ref: getSchemaPath(PaginatedResult) },
        {
          properties: {
            data: {
              type: 'array',
              items: { $ref: getSchemaPath(Educa) },
            },
          },
        },
      ],
    },
  })
  async getEduca(
    @Query('page') page: number = 1,
    @Query('size') size: number = 10,
  ): Promise<PaginatedResult<Educa>> {
    return this.educaService.getEducaPaginado(page, size);
  }

  @Put('/:id')
  @ApiOperation({ summary: 'Actualizar registro educativo por id' })
  @ApiBody({ type: EducaPayloadDto })
  @ApiOkResponse({
    description: 'Registro actualizado correctamente',
    schema: {
      allOf: [
        { $ref: getSchemaPath(ResultWithData) },
        { properties: { data: { $ref: getSchemaPath(Educa) } } },
      ],
    },
  })
  async updateEduca(
    @Param('id') id: number,
    @Body() payload: EducaPayloadDto,
  ): Promise<ResultWithData<Educa>> {
    return this.educaService.updateEduca(id, payload);
  }

  @Delete('/:id')
  @ApiOperation({ summary: 'Eliminar registro educativo (borrado lógico)' })
  @ApiOkResponse({
    description: 'Resultado de la operación',
    schema: { $ref: getSchemaPath(SimpleResult) },
  })
  async deleteEduca(@Param('id') id: number): Promise<SimpleResult> {
    return this.educaService.softDeleteEduca(id);
  }
}