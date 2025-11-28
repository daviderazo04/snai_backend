import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EstadoCivil } from './entities/estadoCivil';
import { Etnia } from './entities/etnia.entity';
import { Gdos } from './entities/gdos';
import { Nacionalidad } from './entities/nacionalidad.entity';
import { Parentesco } from './entities/parentesco.entity';
import { EstadoCivilService } from './services/estadoCivil.service';
import { EstadoCivilController } from './controllers/estadoCivil.controller';
import { EtniaService } from './services/etnia.service';
import { EtniaController } from './controllers/etnia.controller';
import { GdosService } from './services/gdos.service';
import { GdosController } from './controllers/gdos.controller';
import { NacionalidadService } from './services/nacionalidad.service';
import { NacionalidadController } from './controllers/nacionalidad.controller';
import { ParentescoService } from './services/parentesco.service';
import { ParentescoController } from './controllers/parentesco.controller';
import { CommonModule } from '../common/common.module';
import { UsuarioModule } from '../usuario/usuario.module';

@Module({
  imports: [
    CommonModule,
    UsuarioModule,
    TypeOrmModule.forFeature([
      EstadoCivil,
      Etnia,
      Gdos,
      Nacionalidad,
      Parentesco,
    ]),
  ],
  controllers: [
    EstadoCivilController,
    EtniaController,
    GdosController,
    NacionalidadController,
    ParentescoController,
  ],
  providers: [
    EstadoCivilService,
    EtniaService,
    GdosService,
    NacionalidadService,
    ParentescoService,
  ],
})
export class ParametrosModule {}
