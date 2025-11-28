import { Module } from '@nestjs/common';
import { CommonModule } from '../common/common.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Provincia } from './entities/provincia.entity';
import { Canton } from './entities/canton.entity';
import { LocalidadService } from './localidad.service';
import { ProvinciasController } from './provincias.controller';
import { CantonesController } from './cantones.controller';
import { CaiController } from './cai.controller';
import { UsuarioModule } from '../usuario/usuario.module';
import { Cai } from './entities/cai.entity';
import { CaiService } from './cai.service';

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
