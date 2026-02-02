import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ReportesDemograficosService } from '../services/reportes.demograficos.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { PermisosGuard } from '../../common/guards/permisos.guard';
import { ReportResult } from '../ReportResult';
import { ReportMatrixResult } from '../report-matrix.result';

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

  @Get('matriz/nacionalidad')
  @ApiOperation({ summary: 'Matriz Nacionalidad vs CAI' })
  @ApiOkResponse({ type: ReportMatrixResult })
  async getMatrizNacionalidad() {
    return await this.reportesDemograficosService.getReporteNacionalidadPorCai();
  }

  @Get('matriz/edad')
  @ApiOperation({ summary: 'Matriz Edad vs CAI' })
  @ApiOkResponse({ type: ReportMatrixResult })
  async getMatrizEdad() {
    return await this.reportesDemograficosService.getReporteEdadPorCai();
  }

  @Get('matriz/infraccion')
  @ApiOperation({ summary: 'Matriz Infracción vs CAI' })
  @ApiOkResponse({ type: ReportMatrixResult })
  async getMatrizInfraccion() {
    return await this.reportesDemograficosService.getReporteDelitoPorCai();
  }

  @Get('matriz/medidas')
  @ApiOperation({ summary: 'Matriz Medidas vs CAI' })
  @ApiOkResponse({ type: ReportMatrixResult })
  async getMatrizMedidas() {
    return await this.reportesDemograficosService.getReporteMedidasPorCai();
  }
}
