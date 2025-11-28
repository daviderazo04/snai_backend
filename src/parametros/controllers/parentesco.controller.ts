import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
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
import { ParentescoService } from '../services/parentesco.service';
import { ParamPayload } from '../dto/param.payload';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { PermisosGuard } from '../../common/guards/permisos.guard';
import { ResultWithData } from '../../common/dto/result.dto';
import { PaginatedResult } from '../../common/dto/paginated.result.dto';
import { Parentesco } from '../entities/parentesco.entity';

@ApiTags('Parentesco')
@ApiExtraModels(ResultWithData, PaginatedResult, Parentesco)
@UseGuards(JwtAuthGuard, PermisosGuard)
@Controller('parentesco')
export class ParentescoController {
  constructor(private readonly parentescoService: ParentescoService) {}
  @Post()
  @ApiOperation({ summary: 'Crear un parentesco' })
  @ApiBody({ type: ParamPayload })
  @ApiCreatedResponse({
    description: 'Parentesco creado correctamente',
    schema: {
      allOf: [
        { $ref: getSchemaPath(ResultWithData) },
        {
          properties: {
            data: { $ref: getSchemaPath(Parentesco) },
          },
        },
      ],
    },
  })
  @ApiBadRequestResponse({
    description:
      'El payload no cumple las validaciones o no se pudo crear el parentesco',
  })
  async createParentesco(
    @Body() payload: ParamPayload,
  ): Promise<ResultWithData<Parentesco>> {
    return await this.parentescoService.createParentesco(payload);
  }
  @Get()
  @ApiOperation({
    summary: 'Listar parentescos de forma paginada',
  })
  @ApiQuery({ name: 'nombre', required: false, type: String })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'size', required: false, type: Number })
  @ApiOkResponse({
    description: 'Listado paginado de parentescos',
    schema: {
      allOf: [
        { $ref: getSchemaPath(PaginatedResult) },
        {
          properties: {
            data: {
              type: 'array',
              items: { $ref: getSchemaPath(Parentesco) },
            },
          },
        },
      ],
    },
  })
  async getParentesco(
    @Query('nombre') nombre: string = '',
    @Query('page') page: number = 1,
    @Query('size') size: number = 10,
  ): Promise<PaginatedResult<Parentesco>> {
    return await this.parentescoService.getPaginatedParentesco(
      nombre,
      page,
      size,
    );
  }
}
