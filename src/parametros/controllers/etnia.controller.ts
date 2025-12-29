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
import { EtniaService } from '../services/etnia.service';
import { ParamPayload } from '../dto/param.payload';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { PermisosGuard } from '../../common/guards/permisos.guard';
import { ResultWithData, SimpleResult } from '../../common/dto/result.dto';
import { PaginatedResult } from '../../common/dto/paginated.result.dto';
import { Etnia } from '../entities/etnia.entity';
import { Auditar } from '../../auditoria/decorators/auditar.decorator';
import { EstadoCivil } from '../entities/estadoCivil';

@ApiTags('Etnia')
@ApiExtraModels(ResultWithData, PaginatedResult, Etnia)
@UseGuards(JwtAuthGuard, PermisosGuard)
@Controller('etnia')
export class EtniaController {
  constructor(private readonly etniaService: EtniaService) {}
  @Post()
  @ApiOperation({ summary: 'Crear una etnia' })
  @ApiBody({ type: ParamPayload })
  @ApiCreatedResponse({
    description: 'Etnia creada correctamente',
    schema: {
      allOf: [
        { $ref: getSchemaPath(ResultWithData) },
        {
          properties: {
            data: { $ref: getSchemaPath(Etnia) },
          },
        },
      ],
    },
  })
  @ApiBadRequestResponse({
    description:
      'El payload no cumple las validaciones o no se pudo crear la etnia',
  })
  async createEtnia(
    @Body() payload: ParamPayload,
  ): Promise<ResultWithData<Etnia>> {
    return await this.etniaService.createEtnia(payload);
  }
  @Get()
  @ApiOperation({
    summary: 'Listar etnias de forma paginada',
  })
  @ApiQuery({ name: 'nombre', required: false, type: String })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'size', required: false, type: Number })
  @ApiOkResponse({
    description: 'Listado paginado de etnias',
    schema: {
      allOf: [
        { $ref: getSchemaPath(PaginatedResult) },
        {
          properties: {
            data: {
              type: 'array',
              items: { $ref: getSchemaPath(Etnia) },
            },
          },
        },
      ],
    },
  })
  async getEtnia(
    @Query('nombre') nombre: string = '',
    @Query('page') page: number = 1,
    @Query('size') size: number = 10,
  ): Promise<PaginatedResult<Etnia>> {
    return await this.etniaService.getPaginatedEtnia(nombre, page, size);
  }

  @Delete('/:id')
  @ApiOperation({
    summary: 'Eliminar un estado civil',
  })
  @ApiOkResponse({
    description: 'Etnia eliminada correctamente',
    schema: { $ref: getSchemaPath(SimpleResult) },
  })
  @Auditar(Etnia)
  async deleteEtnia(@Param('id') id: number): Promise<SimpleResult> {
    return await this.etniaService.softDeleteEtnia(id);
  }
  @Patch('/:id')
  @ApiOperation({
    summary: 'Editar una etnia',
  })
  @ApiOkResponse({
    description: 'Estado civil editado correctamente',
    schema: {
      $ref: getSchemaPath(ResultWithData),
      properties: { data: { $ref: getSchemaPath(Etnia) } },
    },
  })
  @Auditar(Etnia)
  async updateEtnia(
    @Param('id') id: number,
    @Body() payload: ParamPayload,
  ): Promise<SimpleResult> {
    return await this.etniaService.editEtnia(id, payload);
  }
}
