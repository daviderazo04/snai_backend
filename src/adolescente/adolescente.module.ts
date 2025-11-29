import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommonModule } from '../common/common.module';
import { UsuarioModule } from '../usuario/usuario.module';
import { Adolescente } from './entities/adolescente.entity';
import { AdolescenteService } from './services/adolescente.service';
import { AdolescentesController } from './controllers/adolescente.controller';
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

@Module({
  imports: [
    CommonModule,
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
    ]),
  ],
  controllers: [AdolescentesController],
  providers: [AdolescenteService, RepresentanteService, RepInfractorService],
})
export class AdolescenteModule {}
