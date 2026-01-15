import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Adolescente } from '../adolescente/entities/adolescente.entity';
import { ReportesDemograficosService } from './services/reportes.demograficos.service';
import { ReporteriaController } from './controllers/reporteria.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Adolescente])],
  providers: [ReportesDemograficosService],
  controllers: [ReporteriaController],
})
export class ReporteriaModule {}
