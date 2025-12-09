import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsuarioService } from './services/usuario.service';
import { Usuario } from './entities/usuario.entity';
import { CommonModule } from '../common/common.module';
import { Endpoint } from './entities/endpoints.entity';
import { Perfil } from './entities/perfil.entity';
import { Permiso } from './entities/permisos.entity';
import { Sesion } from './entities/sesion.entity';
import { PerfilController } from './controllers/perfil.controller';
import { RolesService } from './services/roles.service';
import { UsuarioController } from './controllers/usuario.controller';
import { PermisosGuard } from '../common/guards/permisos.guard';
import { AuditoriaModule } from '../auditoria/auditoria.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Usuario, Endpoint, Perfil, Permiso, Sesion]),
  ],
  providers: [UsuarioService, RolesService, PermisosGuard, RolesService],
  exports: [UsuarioService, PermisosGuard, RolesService],
  controllers: [PerfilController, UsuarioController],
})
export class UsuarioModule {}
