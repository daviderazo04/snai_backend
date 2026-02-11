import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBody,
  ApiBearerAuth,
  ApiExtraModels,
  ApiOperation,
  ApiOkResponse,
  ApiParam,
  ApiQuery,
  ApiTags,
  getSchemaPath,
} from '@nestjs/swagger';
import { Usuario } from '../entities/usuario.entity';
import { PaginatedResult } from '../../common/dto/paginated.result.dto';
import { UsuarioService } from '../services/usuario.service';
import { PerfilAsignarPayload } from '../dto/perfil.asignar.payload.dto';
import { RolesService } from '../services/roles.service';
import { ResultWithData, SimpleResult } from '../../common/dto/result.dto';
import { PermisosGuard } from '../../common/guards/permisos.guard';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import {
  PerfilFlatResponseDto,
  PermisoFlatResponseDto,
  UsuarioWithPerfilFlatResponseDto,
} from '../dto/permiso.flat.response.dto';
@ApiTags('Usuario')
@ApiBearerAuth('jwt-auth')
@UseGuards(JwtAuthGuard, PermisosGuard)
@Controller('usuario')
export class UsuarioController {
  constructor(
    private readonly userService: UsuarioService,
    private readonly rolesService: RolesService,
  ) {}
  @Post('/perfil/:id')
  @ApiOperation({
    summary: 'Asignar un perfil a un usuario',
    description:
      'Asocia un perfil existente a un usuario específico y devuelve el resultado de la operación.',
  })
  @ApiParam({ name: 'id', type: Number, description: 'ID del usuario' })
  @ApiBody({ type: PerfilAsignarPayload })
  @ApiOkResponse({
    description: 'Perfil asignado correctamente',
    type: SimpleResult,
  })
  async asignarPerfil(
    @Param('id') id: number,
    @Body() payload: PerfilAsignarPayload,
  ) {
    return await this.rolesService.asignarPerfil(id, payload);
  }

  @Get()
  @ApiOperation({
    summary: 'Listar usuarios paginados',
    description:
      'Devuelve los usuarios sanitizados con filtros opcionales por nombre.',
  })
  @ApiExtraModels(Usuario, PaginatedResult)
  @ApiQuery({ name: 'nombre', required: false, type: String })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'size', required: false, type: Number })
  @ApiOkResponse({
    description: 'Lista paginada de usuarios santizados',
    schema: {
      allOf: [
        { $ref: getSchemaPath(PaginatedResult) },
        {
          properties: {
            data: {
              type: 'array',
              items: { $ref: getSchemaPath(Usuario) },
            },
          },
        },
      ],
    },
  })
  async getUsuarios(
    @Query('nombre') nombre: string = '',
    @Query('page') page: number = 1,
    @Query('size') size: number = 10,
  ) {
    return await this.userService.getSanitizedUsuarios(nombre, page, size);
  }
  @Get('/detalle/:id')
  @ApiOperation({
    summary: 'Detalle de usuario con perfiles y permisos',
  })
  @ApiParam({ name: 'id', type: Number, description: 'ID del usuario' })
  @ApiExtraModels(
    ResultWithData,
    UsuarioWithPerfilFlatResponseDto,
    PerfilFlatResponseDto,
    PermisoFlatResponseDto,
  )
  @ApiOkResponse({
    description: 'Detalle del usuario obtenido correctamente',
    schema: {
      allOf: [
        { $ref: getSchemaPath(ResultWithData) },
        {
          properties: {
            data: { $ref: getSchemaPath(UsuarioWithPerfilFlatResponseDto) },
          },
        },
      ],
    },
  })
  async getDetalleUsuario(@Param('id') id: number) {
    return await this.userService.getUsuarioWithPerfiles(id);
  }
}
