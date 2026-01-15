import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ReportesDemograficosService } from '../services/reportes.demograficos.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { PermisosGuard } from '../../common/guards/permisos.guard';
import { ReportResult } from '../ReportResult';

@ApiTags('Reportería')
@UseGuards(JwtAuthGuard, PermisosGuard)
@Controller('reporteria')
export class ReporteriaController {
  constructor(
    private readonly reportesDemograficosService: ReportesDemograficosService,
  ) {}

  @Get('demografico/etnia')
  @ApiOperation({
    summary: 'Reporte demográfico por etnia',
    description: 'Retorna la cantidad de adolescentes agrupados por etnia.',
  })
  @ApiOkResponse({
    description: 'Datos del reporte demográfico por etnia',
    type: ReportResult,
  })
  async getReporteDemograficoEtnia() {
    return await this.reportesDemograficosService.getReporteDemograficoEtnia();
  }
}
