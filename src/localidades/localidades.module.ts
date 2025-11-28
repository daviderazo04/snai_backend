import { Module } from '@nestjs/common';
import { CommonModule } from '../common/common.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Provincia } from './entities/provincia.entity';
import { Canton } from './entities/canton.entity';
import { LocalidadService } from './services/localidad.service';
import { ProvinciasController } from './controllers/provincias.controller';
import { CantonesController } from './controllers/cantones.controller';
import { CaiController } from './controllers/cai.controller';
import { UsuarioModule } from '../usuario/usuario.module';
import { Cai } from './entities/cai.entity';
import { CaiService } from './services/cai.service';

@Module({
  imports: [
    CommonModule,
    UsuarioModule,
    TypeOrmModule.forFeature([Provincia, Canton, Cai]),
  ],
  providers: [LocalidadService, CaiService],
  controllers: [ProvinciasController, CantonesController, CaiController],
})
export class LocalidadesModule {}
