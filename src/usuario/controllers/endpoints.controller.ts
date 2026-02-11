import { Controller, Get, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { RolesService } from '../services/roles.service';
import { EndpointFlatResponseDto } from '../dto/endpoint.flat.response.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { PermisosGuard } from '../../common/guards/permisos.guard';

@ApiTags('Usuario')
@ApiBearerAuth('jwt-auth')
@UseGuards(JwtAuthGuard, PermisosGuard)
@Controller('endpoints')
export class EndpointsController {
  constructor(private readonly rolesService: RolesService) {}

  @Get()
  @ApiOperation({
    summary: 'Obtener los endpoints aplanados disponibles',
    description:
      'Devuelve cada endpoint y su descripción en el mismo formato que se usa al autenticarse.',
  })
  @ApiOkResponse({
    description: 'Listado de endpoints aplanados',
    type: EndpointFlatResponseDto,
    isArray: true,
  })
  async getEndpoints(): Promise<EndpointFlatResponseDto[]> {
    return this.rolesService.getFlatEndpoints();
  }
}
