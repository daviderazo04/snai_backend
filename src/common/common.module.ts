import { Module } from '@nestjs/common';
import { CryptService } from './crypt.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { JwtStrategy } from './jwt/jwt.strategy';

@Module({
  providers: [CryptService, JwtAuthGuard, JwtStrategy],
  exports: [CryptService, JwtAuthGuard, JwtStrategy],
})
export class CommonModule {}
