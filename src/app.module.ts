import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { UsuarioModule } from './usuario/usuario.module';
import { AuthModule } from './auth/auth.module';
import { CommonModule } from './common/common.module';
import { LocalidadesModule } from './localidades/localidades.module';
import { ParametrosModule } from './parametros/parametros.module';
import { AdolescenteModule } from './adolescente/adolescente.module';
import { InfoAdolescenteModule } from './info-adolescente/info-adolescente.module';
import { AuditoriaModule } from './auditoria/auditoria.module';
import { ReporteriaModule } from './reporteria/reporteria.module';
import 'dotenv/config';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: process.env.ENV_FILE || '.env',
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('DB_HOST'),
        port: +configService.get('DB_PORT'),
        username: configService.get('DB_USERNAME'),
        password: configService.get('DB_PASSWORD'),
        database: configService.get('DB_NAME'),
        ssl:
          configService.get('DB_SSL') === 'require'
            ? { rejectUnauthorized: false }
            : false,

        autoLoadEntities: true,
        synchronize: process.env.NODE_ENV !== 'production',
        logging: true, // Para debug
      }),
      inject: [ConfigService],
    }),
    UsuarioModule,
    AuthModule,
    LocalidadesModule,
    ParametrosModule,
    AdolescenteModule,
    InfoAdolescenteModule,
    AuditoriaModule,
    CommonModule,
    ReporteriaModule,
  ],
  controllers: [],
})
export class AppModule {}
