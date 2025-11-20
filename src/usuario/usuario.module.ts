import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsuarioService } from './usuario.service';
import { Usuario } from './entities/usuario.entity';
import { CommonModule } from '../common/common.module';
import { Endpoint } from './entities/endpoints.entity';
import { Perfil } from './entities/perfil.entity';
import { Permiso } from './entities/permisos.entity';
import { Sesion } from './entities/sesion.entity';

@Module({
  imports: [
    CommonModule,
    TypeOrmModule.forFeature([Usuario, Endpoint, Perfil, Permiso, Sesion]),
  ],
  providers: [UsuarioService],
  exports: [UsuarioService],
})
export class UsuarioModule {}
