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
import { Traslado } from './entities/traslado.entity';
import { TrasladoService } from './services/traslado.service';
import { TrasladoController } from './controllers/traslado.controller';
import { Adolescente } from '../adolescente/entities/adolescente.entity';

@Module({
  imports: [
    UsuarioModule,
    TypeOrmModule.forFeature([Provincia, Canton, Cai, Traslado, Adolescente]),
  ],
  providers: [ProvinciaService, CantonService, CaiService, TrasladoService],
  controllers: [
    ProvinciasController,
    CantonesController,
    CaiController,
    TrasladoController,
  ],
})
export class LocalidadesModule {}
