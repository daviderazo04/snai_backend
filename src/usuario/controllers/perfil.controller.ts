import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { PerfilPayloadDto } from '../dto/perfil.payload.dto';
import { RolesService } from '../services/roles.service';
import {
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
import { ResultWithData } from '../../common/dto/result.dto';
import { PerfilUpdatePayloadDto } from '../dto/perfil.update.payload.dto';
import { Perfil } from '../entities/perfil.entity';
import { PaginatedResult } from '../../common/dto/paginated.result.dto';
import { UsuarioService } from '../services/usuario.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { PermisosGuard } from '../../common/guards/permisos.guard';
import {
  PerfilFlatResponseDto,
  PermisoFlatResponseDto,
} from '../dto/permiso.flat.response.dto';

@ApiTags('Perfiles')
@ApiBearerAuth('jwt-auth')
@UseGuards(JwtAuthGuard, PermisosGuard)
@Controller('perfil')
export class PerfilController {
  constructor(
    private readonly roleService: RolesService,
    private readonly userService: UsuarioService,
  ) {}
  @Post('')
  @ApiOperation({ summary: 'Crear perfil de usuario' })
  @ApiExtraModels(ResultWithData, Perfil)
  @ApiBody({ type: PerfilPayloadDto })
  @ApiCreatedResponse({
    description: 'Perfil creado exitosamente',
    schema: {
      allOf: [
        { $ref: getSchemaPath(ResultWithData) },
        {
          properties: {
            data: { $ref: getSchemaPath(Perfil) },
          },
        },
      ],
    },
  })
  async createPerfil(
    @Body() payload: PerfilPayloadDto,
  ): Promise<ResultWithData<Perfil>> {
    return await this.roleService.createPerfil(payload);
  }
  @Patch('/:id')
  @ApiOperation({ summary: 'Editar perfil de usuario' })
  @ApiParam({ name: 'id', type: Number, description: 'ID del perfil' })
  @ApiExtraModels(ResultWithData, Perfil)
  @ApiBody({ type: PerfilUpdatePayloadDto })
  @ApiOkResponse({
    description: 'Perfil actualizado exitosamente',
    schema: {
      allOf: [
        { $ref: getSchemaPath(ResultWithData) },
        {
          properties: {
            data: { $ref: getSchemaPath(Perfil) },
          },
        },
      ],
    },
  })
  async updatePerfil(
    @Param('id') id: number,
    @Body() payload: PerfilUpdatePayloadDto,
  ): Promise<ResultWithData<Perfil>> {
    return await this.roleService.updatePerfil(id, payload);
  }
  @Get('')
  @ApiOperation({
    summary: 'Listar perfiles paginados',
    description: 'Devuelve los perfiles con filtros opcionales por nombre.',
  })
  @ApiExtraModels(Perfil, PaginatedResult)
  @ApiQuery({ name: 'nombre', required: false, type: String })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'size', required: false, type: Number })
  @ApiOkResponse({
    description: 'Lista paginada de perfiles',
    schema: {
      allOf: [
        { $ref: getSchemaPath(PaginatedResult) },
        {
          properties: {
            data: {
              type: 'array',
              items: { $ref: getSchemaPath(Perfil) },
            },
          },
        },
      ],
    },
  })
  async getPerfiles(
    @Query('nombre') nombre: string = '',
    @Query('page') page: number = 1,
    @Query('size') size: number = 10,
  ) {
    return await this.roleService.getPerfiles(nombre, page, size);
  }
  @Get('/detalle/:id')
  @ApiOperation({ summary: 'Detalle de permisos de un perfil' })
  @ApiParam({ name: 'id', type: Number, description: 'ID del perfil' })
  @ApiExtraModels(
    ResultWithData,
    PerfilFlatResponseDto,
    PermisoFlatResponseDto,
  )
  @ApiOkResponse({
    description: 'Permisos del perfil obtenidos correctamente',
    schema: {
      allOf: [
        { $ref: getSchemaPath(ResultWithData) },
        {
          properties: {
            data: { $ref: getSchemaPath(PerfilFlatResponseDto) },
          },
        },
      ],
    },
  })
  async getDetallePerfil(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<ResultWithData<PerfilFlatResponseDto>> {
    return await this.roleService.getFlatPermisosResultData(id);
  }
}
