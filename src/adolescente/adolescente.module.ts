import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsuarioModule } from '../usuario/usuario.module';
import { Adolescente } from './entities/adolescente.entity';
import { AdolescenteService } from './services/adolescente.service';
import { AdolescentesController } from './controllers/adolescente.controller';
import { RepresentantesController } from './controllers/representante.controller';
import { RepInfractoresController } from './controllers/repInfractor.controller';
import { Cai } from 'src/localidades/entities/cai.entity';
import { Nacionalidad } from 'src/parametros/entities/nacionalidad.entity';
import { EstadoCivil } from 'src/parametros/entities/estadoCivil';
import { Gdos } from 'src/parametros/entities/gdos';
import { Etnia } from 'src/parametros/entities/etnia.entity';
import { Canton } from 'src/localidades/entities/canton.entity';
import { Representante } from './entities/representante.entity';
import { Parentesco } from 'src/parametros/entities/parentesco.entity';
import { RepInfractor } from './entities/repInfractor.entity';
import { RepresentanteService } from './services/representante.service';
import { RepInfractorService } from './services/repInfractor.service';
import { Juridico } from 'src/info-adolescente/entities/juridico.entity';
import { Ocupacion } from 'src/info-adolescente/entities/ocupacion.entity';
import { Familia } from 'src/info-adolescente/entities/familia.entity';
import { Salud } from 'src/info-adolescente/entities/salud.entity';
import { Educa } from 'src/info-adolescente/entities/educa.entity';
import { Traslado } from 'src/localidades/entities/traslado.entity';

@Module({
  imports: [
    UsuarioModule,
    TypeOrmModule.forFeature([
      Adolescente,
      Cai,
      Nacionalidad,
      EstadoCivil,
      Gdos,
      Etnia,
      Canton,
      Representante,
      Parentesco,
      RepInfractor,
      Juridico,
      Ocupacion,
      Familia,
      Salud,
      Educa,
      Traslado,
    ]),
  ],
  controllers: [
    AdolescentesController,
    RepresentantesController,
    RepInfractoresController,
  ],
  providers: [AdolescenteService, RepresentanteService, RepInfractorService],
})
export class AdolescenteModule {}
