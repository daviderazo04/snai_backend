import { Global, Module } from '@nestjs/common';

import { Auditoria } from './entities/auditoria.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuditoriaService } from './auditoria.service';
import { UsuarioModule } from '../usuario/usuario.module';
import { AuditoriaBeforeInterceptor } from './interceptors/auditoria.before.interceptor';
import { AuditoriaAfterInterceptor } from './interceptors/auditoria.after.interceptor';
@Global()
@Module({
  imports: [TypeOrmModule.forFeature([Auditoria]), UsuarioModule],
  providers: [
    AuditoriaService,
    AuditoriaBeforeInterceptor,
    AuditoriaAfterInterceptor,
  ],
  exports: [
    AuditoriaService,
    AuditoriaBeforeInterceptor,
    AuditoriaAfterInterceptor,
  ],
})
export class AuditoriaModule {}
