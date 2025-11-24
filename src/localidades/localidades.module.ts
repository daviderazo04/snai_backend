import { Module } from '@nestjs/common';
import { CommonModule } from '../common/common.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Provincia } from './entities/provincia.entity';
import { Canton } from './entities/canton.entity';

@Module({
  imports: [CommonModule, TypeOrmModule.forFeature([Provincia, Canton])],
})
export class LocalidadesModule {}
