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
  ApiExtraModels,
  ApiOkResponse,
  ApiParam,
  ApiQuery,
  getSchemaPath,
} from '@nestjs/swagger';
import { Usuario } from '../entities/usuario.entity';
import { PaginatedResult } from '../../common/dto/paginated.result.dto';
import { UsuarioService } from '../services/usuario.service';
import { PerfilAsignarPayload } from '../dto/perfil.asignar.payload.dto';
import { RolesService } from '../services/roles.service';
import { SimpleResult } from 'src/common/dto/result.dto';
import { PermisosGuard } from '../../auth/guards/permisos.guard';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
@UseGuards(JwtAuthGuard, PermisosGuard)
@Controller('usuario')
export class UsuarioController {
  constructor(
    private readonly userService: UsuarioService,
    private readonly rolesService: RolesService,
  ) {}
  @Post('/perfil')
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
}
