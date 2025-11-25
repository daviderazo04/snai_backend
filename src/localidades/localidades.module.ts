import { Module } from '@nestjs/common';
import { CommonModule } from '../common/common.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Provincia } from './entities/provincia.entity';
import { Canton } from './entities/canton.entity';
import { LocalidadService } from './localidad.service';
import { LocalidadesController } from './localidades.controller';
import { UsuarioModule } from '../usuario/usuario.module';

@Module({
  imports: [
    CommonModule,
    UsuarioModule,
    TypeOrmModule.forFeature([Provincia, Canton]),
  ],
  providers: [LocalidadService],
  controllers: [LocalidadesController],
})
export class LocalidadesModule {}
