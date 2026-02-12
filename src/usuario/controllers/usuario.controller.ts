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
import { UpdateUsuarioInformacionDto } from '../dto/update-usuario.dto';
import { UpdateUsuarioPasswordDto } from '../dto/update-usuario.dto';
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
  @Delete('/:id')
  @ApiOperation({
    summary: 'Desactivar usuario (soft delete)',
    description:
      'Marca al usuario como inactivo sin eliminarlo físicamente y devuelve el registro actualizado.',
  })
  @ApiParam({ name: 'id', type: Number, description: 'ID del usuario' })
  @ApiExtraModels(ResultWithData, Usuario)
  @ApiOkResponse({
    description: 'Usuario desactivado correctamente',
    schema: {
      allOf: [
        { $ref: getSchemaPath(ResultWithData) },
        {
          properties: {
            data: { $ref: getSchemaPath(Usuario) },
          },
        },
      ],
    },
  })
  async softDelete(@Param('id') id: number) {
    return await this.userService.softDelete(id);
  }
  @Patch('/reactivar/:id')
  @ApiOperation({
    summary: 'Reactivar usuario',
    description:
      'Marca al usuario como activo nuevamente y devuelve el registro actualizado.',
  })
  @ApiParam({ name: 'id', type: Number, description: 'ID del usuario' })
  @ApiExtraModels(ResultWithData, Usuario)
  @ApiOkResponse({
    description: 'Usuario reactivado correctamente',
    schema: {
      allOf: [
        { $ref: getSchemaPath(ResultWithData) },
        {
          properties: {
            data: { $ref: getSchemaPath(Usuario) },
          },
        },
      ],
    },
  })
  async resturar(@Param('id') id: number) {
    return await this.userService.restaurarUsuario(id);
  }
  @Patch('/informacion/:id')
  @ApiOperation({
    summary: 'Actualizar información básica de un usuario',
    description:
      'Actualiza datos personales (cedula, nombre, apellido, sexo, telefono, direccion y correo) y devuelve el registro actualizado.',
  })
  @ApiParam({ name: 'id', type: Number, description: 'ID del usuario' })
  @ApiBody({ type: UpdateUsuarioInformacionDto })
  @ApiExtraModels(ResultWithData, Usuario)
  @ApiOkResponse({
    description: 'Información actualizada correctamente',
    schema: {
      allOf: [
        { $ref: getSchemaPath(ResultWithData) },
        {
          properties: {
            data: { $ref: getSchemaPath(Usuario) },
          },
        },
      ],
    },
  })
  async updateInformacion(
    @Param('id') id: number,
    @Body() payload: UpdateUsuarioInformacionDto,
  ) {
    return await this.userService.updateinfo(id, payload);
  }
  @Patch('/password/:id')
  @ApiOperation({
    summary: 'Actualizar contraseña de un usuario',
    description:
      'Actualiza la contraseña del usuario especificado y devuelve el registro actualizado.',
  })
  @ApiParam({ name: 'id', type: Number, description: 'ID del usuario' })
  @ApiBody({ type: UpdateUsuarioPasswordDto })
  @ApiExtraModels(ResultWithData, Usuario)
  @ApiOkResponse({
    description: 'Contraseña actualizada correctamente',
    schema: {
      allOf: [
        { $ref: getSchemaPath(ResultWithData) },
        {
          properties: {
            data: { $ref: getSchemaPath(Usuario) },
          },
        },
      ],
    },
  })
  async updatePassword(
    @Param('id') id: number,
    @Body() payload: UpdateUsuarioPasswordDto,
  ) {
    return await this.userService.updatePassword(id, payload);
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
