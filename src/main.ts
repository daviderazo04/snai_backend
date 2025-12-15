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

  app.enableCors({ origin: '*' });

  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  const config = new DocumentBuilder()
    .setTitle('Backend Snai')
    .setDescription('BAckend del proyecto snai :v')
    .setVersion('1.0')
    .addTag('back')
    .build();
  const beforeInterceptor = app.get(AuditoriaBeforeInterceptor);
  const afterInterceptor = app.get(AuditoriaAfterInterceptor);

  app.useGlobalInterceptors(beforeInterceptor, afterInterceptor);

  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, documentFactory);

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
