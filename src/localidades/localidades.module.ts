import { Module } from '@nestjs/common';
import { CommonModule } from '../common/common.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Provincia } from './entities/provincia.entity';
import { Canton } from './entities/canton.entity';
import { ProvinciasController } from './controllers/provincias.controller';
import { CantonesController } from './controllers/cantones.controller';
import { CaiController } from './controllers/cai.controller';
import { UsuarioModule } from '../usuario/usuario.module';
import { Cai } from './entities/cai.entity';
import { CaiService } from './services/cai.service';
import { AuditoriaModule } from '../auditoria/auditoria.module';
import { ProvinciaService } from './services/provincia.service';
import { CantonService } from './services/canton.service';

@Module({
  imports: [UsuarioModule, TypeOrmModule.forFeature([Provincia, Canton, Cai])],
  providers: [ProvinciaService, CantonService, CaiService],
  controllers: [ProvinciasController, CantonesController, CaiController],
})
export class LocalidadesModule {}
