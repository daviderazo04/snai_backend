import { Global, Module } from '@nestjs/common';
import { CryptService } from './crypt.service';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { JwtStrategy } from './jwt/jwt.strategy';
import { AuditoriaModule } from '../auditoria/auditoria.module';
@Global()
@Module({
  providers: [CryptService, JwtAuthGuard, JwtStrategy],
  exports: [CryptService, JwtAuthGuard, JwtStrategy],
  imports: [AuditoriaModule],
})
export class CommonModule {}
