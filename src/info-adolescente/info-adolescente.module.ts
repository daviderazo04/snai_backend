import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

// 1. Importamos las Entidades
import { Delito } from './entities/delito.entity';
import { Juridico } from './entities/juridico.entity';
import { Ocupacion } from './entities/ocupacion.entity';
import { Evento } from './entities/evento.entity';
import { Familia } from './entities/familia.entity';
// Importamos Adolescente porque tus servicios usan @InjectRepository(Adolescente)
import { Adolescente } from '../adolescente/entities/adolescente.entity';

// 2. Importamos los Controladores
import { DelitoController } from './controllers/delito.controller';
import { JuridicoController } from './controllers/juridico.controller';
import { OcupacionController } from './controllers/ocupacion.controller';
import { EventoController } from './controllers/evento.controller';
import { FamiliaController } from './controllers/familia.controller';

// 3. Importamos los Servicios
import { DelitoService } from './services/delito.service';
import { JuridicoService } from './services/juridico.service';
import { OcupacionService } from './services/ocupacion.service';
import { EventoService } from './services/evento.service';
import { FamiliaService } from './services/familia.service';
import { UsuarioModule } from '../usuario/usuario.module';

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
    ]),
  ],
  controllers: [
    DelitoController,
    JuridicoController,
    OcupacionController,
    EventoController,
    FamiliaController,
  ],
  providers: [
    DelitoService,
    JuridicoService,
    OcupacionService,
    EventoService,
    FamiliaService,
  ],
  exports: [
    DelitoService,
    JuridicoService,
    OcupacionService,
    EventoService,
    FamiliaService,
  ],
})
export class InfoAdolescenteModule {}
