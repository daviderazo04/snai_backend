import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

// 1. Importamos las Entidades
import { Delito } from './entities/delito.entity';
import { Juridico } from './entities/juridico.entity';
import { Ocupacion } from './entities/ocupacion.entity';
// Importamos Adolescente porque tus servicios usan @InjectRepository(Adolescente)
import { Adolescente } from '../adolescente/entities/adolescente.entity';

// 2. Importamos los Controladores
import { DelitoController } from './controllers/delito.controller';
import { JuridicoController } from './controllers/juridico.controller';
import { OcupacionController } from './controllers/ocupacion.controller';

// 3. Importamos los Servicios
import { DelitoService } from './services/delito.service';
import { JuridicoService } from './services/juridico.service';
import { OcupacionService } from './services/ocupacion.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Delito, Juridico, Ocupacion, Adolescente]),
  ],
  controllers: [DelitoController, JuridicoController, OcupacionController],
  providers: [DelitoService, JuridicoService, OcupacionService],

  exports: [DelitoService, JuridicoService, OcupacionService],
})
export class InfoAdolescenteModule {}
