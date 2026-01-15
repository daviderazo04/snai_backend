import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Adolescente } from '../adolescente/entities/adolescente.entity';
import { ReportesDemograficosService } from './services/reportes.demograficos.service';
import { ReporteriaController } from './controllers/reporteria.controller';
import { UsuarioModule } from '../usuario/usuario.module';
import { AuditoriaModule } from '../auditoria/auditoria.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Adolescente]),
    UsuarioModule,
    AuditoriaModule,
  ],
  providers: [ReportesDemograficosService],
  controllers: [ReporteriaController],
})
export class ReporteriaModule {}
