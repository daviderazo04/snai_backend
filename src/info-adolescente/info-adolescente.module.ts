import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

// 1. Importamos las Entidades
import { Delito } from './entities/delito.entity';
import { Juridico } from './entities/juridico.entity';
import { Ocupacion } from './entities/ocupacion.entity';
import { Evento } from './entities/evento.entity';
import { Familia } from './entities/familia.entity';

import { Salud } from './entities/salud.entity'; 
import { Educa } from './entities/educa.entity';

// Importamos Adolescente porque tus servicios usan @InjectRepository(Adolescente)
import { Adolescente } from '../adolescente/entities/adolescente.entity';

// 2. Importamos los Controladores
import { DelitoController } from './controllers/delito.controller';
import { JuridicoController } from './controllers/juridico.controller';
import { OcupacionController } from './controllers/ocupacion.controller';
import { EventoController } from './controllers/evento.controller';
import { FamiliaController } from './controllers/familia.controller';

import { SaludController } from './controllers/salud.controller';
import { EducaController } from './controllers/educa.controller';

// 3. Importamos los Servicios
import { DelitoService } from './services/delito.service';
import { JuridicoService } from './services/juridico.service';
import { OcupacionService } from './services/ocupacion.service';
import { EventoService } from './services/evento.service';
import { FamiliaService } from './services/familia.service';
import { UsuarioModule } from '../usuario/usuario.module';

import { SaludService } from './services/salud.service';
import { EducaService } from './services/educa.service';


@Module({
  imports: [
    UsuarioModule,
    // Registramos todas las entidades para que los Repositorios existan en este módulo
    TypeOrmModule.forFeature([
      Delito,
      Juridico,
      Ocupacion,
      Evento,
      Familia,
      Adolescente,
      Salud,
      Educa,
    ]),
  ],
  controllers: [
    DelitoController,
    JuridicoController,
    OcupacionController,
    EventoController,
    FamiliaController,
    SaludController,
    EducaController,
  ],
  providers: [
    DelitoService,
    JuridicoService,
    OcupacionService,
    EventoService,
    FamiliaService,
    SaludService,
    EducaService,
  ],
  exports: [
    DelitoService,
    JuridicoService,
    OcupacionService,
    EventoService,
    FamiliaService,
    SaludService,
    EducaService,
  ],
})
export class InfoAdolescenteModule {}
