import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { DataSource } from 'typeorm';
import { AuditoriaBeforeInterceptor } from './auditoria/interceptors/auditoria.before.interceptor';
import { AuditoriaAfterInterceptor } from './auditoria/interceptors/auditoria.after.interceptor';
import { runProdSeeds } from '../seeds/prod.seeds';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const logger = new Logger('Bootstrap');

  try {
    const dataSource = app.get(DataSource);
    await dataSource.runMigrations();
    logger.log('Migraciones aplicadas correctamente');
  } catch (err) {
    logger.error('Error al aplicar migraciones automáticamente', err as Error);
  }

  try {
    await runProdSeeds(app);
    logger.log('Seeds de producción ejecutados correctamente');
  } catch (err) {
    logger.error('Error al ejecutar seeds de producción', err as Error);
  }
  //Por motivos de testeo el cors admite todos los origenes, antes de pasar a prd se debe cambiar esto a la url especifica
  app.enableCors({ origin: '*' });

  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  const config = new DocumentBuilder()
    .setTitle('Backend Snai')
    .setDescription('Backend del proyecto Snai')
    .setVersion('1.0')
    .addTag('back')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description: 'Ingrese el token JWT devuelto por /auth/login',
      },
      'jwt-auth',
    )
    .build();
  const beforeInterceptor = app.get(AuditoriaBeforeInterceptor);
  const afterInterceptor = app.get(AuditoriaAfterInterceptor);

  app.useGlobalInterceptors(beforeInterceptor, afterInterceptor);

  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, documentFactory);

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
