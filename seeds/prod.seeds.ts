import 'dotenv/config';
import { INestApplicationContext, Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from '../src/app.module';
import { DataSource, Repository } from 'typeorm';
import { Endpoint } from '../src/usuario/entities/endpoints.entity';
import { Perfil } from '../src/usuario/entities/perfil.entity';
import { Permiso } from '../src/usuario/entities/permisos.entity';
import { Usuario } from '../src/usuario/entities/usuario.entity';
import { Sesion } from '../src/usuario/entities/sesion.entity';
import { Sexo } from '../src/common/enums/sexo.enums';
import { CryptService } from '../src/common/crypt.service';
import { ALL_ENDPOINTS } from '../src/common/constants/endpoints';

type SeedDeps = {
  endpointRepo: Repository<Endpoint>;
  perfilRepo: Repository<Perfil>;
  permisoRepo: Repository<Permiso>;
  dataSource: DataSource;
  cryptService: CryptService;
  sesionRepo: Repository<Sesion>;
};

async function ensureEndpoints(deps: SeedDeps) {
  const createdOrFound: Endpoint[] = [];
  for (const { endpoint: path, descripcion } of ALL_ENDPOINTS) {
    let endpoint = await deps.endpointRepo.findOneBy({ endpoint: path });
    if (!endpoint) {
      endpoint = deps.endpointRepo.create({ endpoint: path, descripcion });
      endpoint = await deps.endpointRepo.save(endpoint);
      // eslint-disable-next-line no-console
      console.log(`Endpoint creado: ${path}`);
    } else if (!endpoint.descripcion || endpoint.descripcion !== descripcion) {
      endpoint.descripcion = descripcion;
      endpoint = await deps.endpointRepo.save(endpoint);
      // eslint-disable-next-line no-console
      console.log(`Endpoint actualizado: ${path}`);
    }
    createdOrFound.push(endpoint);
  }
  return createdOrFound;
}

async function ensureAdminPerfil(
  deps: SeedDeps,
  endpoints: Endpoint[],
): Promise<Perfil> {
  let perfil = await deps.perfilRepo.findOne({
    where: { nombre: 'Administrador' },
    relations: ['permisos', 'permisos.endpoint'],
  });

  if (!perfil) {
    perfil = deps.perfilRepo.create({
      nombre: 'Administrador',
      descripcion: 'Acceso total inicial (ajustable posteriormente)',
    });
    perfil = await deps.perfilRepo.save(perfil);
    // eslint-disable-next-line no-console
    console.log('Perfil Administrador creado');
  }

  const permisosExistentes =
    perfil.permisos?.map((p) => p.endpoint.endpoint) ?? [];
  for (const endpoint of endpoints) {
    if (permisosExistentes.includes(endpoint.endpoint)) continue;
    const permiso = deps.permisoRepo.create({
      endpoint,
      perfil,
      VIEW: true,
      EDIT: true,
    });
    await deps.permisoRepo.save(permiso);
    // eslint-disable-next-line no-console
    console.log(
      `Permiso agregado para ${endpoint.endpoint} al perfil Administrador`,
    );
  }

  return deps.perfilRepo.findOneOrFail({
    where: { id: perfil.id },
    relations: ['permisos', 'permisos.endpoint'],
  });
}

async function ensureAdminUsuario(
  deps: SeedDeps,
  perfil: Perfil,
): Promise<Usuario> {
  // eslint-disable-next-line no-console
  console.log('== Creando usuario administrador (idempotente) ==');
  const cedula = process.env.SEED_ADMIN_CEDULA ?? '1717171717';
  const correo = process.env.SEED_ADMIN_EMAIL ?? 'admin@snai.local';
  const password = process.env.SEED_ADMIN_PASSWORD ?? 'Admin123!';
  const nombre = process.env.SEED_ADMIN_NOMBRE ?? 'Admin';
  const apellido = process.env.SEED_ADMIN_APELLIDO ?? 'SNIA';
  const columnsRows = await deps.dataSource.query(
    `SELECT column_name FROM information_schema.columns WHERE table_schema = current_schema() AND table_name = 'usuario'`,
  );
  const columns = new Set<string>(
    columnsRows.map((row: { column_name: string }) => row.column_name),
  );
  // eslint-disable-next-line no-console
  console.log(
    `Columnas detectadas en usuario: ${Array.from(columns).join(', ')}`,
  );
  if (!columns.has('cedula')) {
    throw new Error('La columna "cedula" es requerida para el seed.');
  }

  const [found] = await deps.dataSource.query(
    `SELECT id, cedula, correo FROM "usuario" WHERE correo = $1 OR cedula = $2 LIMIT 1`,
    [correo, cedula],
  );

  let usuarioId: number;
  if (!found) {
    const hashed = await deps.cryptService.crypt(password);
    const colNames = ['cedula', 'correo', 'password', 'nombre', 'apellido'];
    const values: unknown[] = [cedula, correo, hashed, nombre, apellido];

    if (columns.has('sexo')) {
      colNames.push('sexo');
      values.push(Sexo.MASCULINO);
    }
    if (columns.has('direccion')) {
      colNames.push('direccion');
      values.push('Direccion administrador');
    }
    if (columns.has('telefono')) {
      colNames.push('telefono');
      values.push('+593000000000');
    }

    const placeholders = colNames.map((_, idx) => `$${idx + 1}`).join(',');
    const insertSql = `INSERT INTO "usuario"(${colNames
      .map((c) => `"${c}"`)
      .join(',')}) VALUES (${placeholders}) RETURNING id`;
    const [inserted] = await deps.dataSource.query(insertSql, values);
    usuarioId = inserted.id as number;
    // eslint-disable-next-line no-console
    console.log(
      `Usuario administrador creado: ${correo} (cedula=${cedula}, id=${usuarioId})`,
    );
  } else {
    usuarioId = found.id as number;
    // eslint-disable-next-line no-console
    console.log(
      `Usuario administrador ya existe: ${found.correo ?? correo} (cedula=${
        found.cedula ?? 'sin cedula'
      }, id=${usuarioId})`,
    );
    if (!found.cedula) {
      await deps.dataSource.query(
        `UPDATE "usuario" SET cedula = $1 WHERE id = $2`,
        [cedula, usuarioId],
      );
      // eslint-disable-next-line no-console
      console.log(
        `Cedula asignada al usuario administrador para soportar login: ${cedula}`,
      );
    }
  }

  const [sesion] = await deps.dataSource.query(
    `SELECT id FROM "sesion" WHERE "usuarioId" = $1 AND "perfilId" = $2 LIMIT 1`,
    [usuarioId, perfil.id],
  );
  if (!sesion) {
    await deps.dataSource.query(
      `INSERT INTO "sesion"("usuarioId","perfilId") VALUES ($1,$2)`,
      [usuarioId, perfil.id],
    );
    // eslint-disable-next-line no-console
    console.log('Perfil Administrador asignado al usuario administrador');
  } else {
    // eslint-disable-next-line no-console
    console.log('El usuario administrador ya tenía el perfil asignado');
  }

  return deps.dataSource.getRepository(Usuario).create({ id: usuarioId });
}

export async function runProdSeeds(
  app: INestApplicationContext,
  opts: { closeApp?: boolean } = {},
) {
  const logger = new Logger('ProdSeeds');
  try {
    const dataSource = app.get(DataSource);
    const deps: SeedDeps = {
      endpointRepo: dataSource.getRepository(Endpoint),
      perfilRepo: dataSource.getRepository(Perfil),
      permisoRepo: dataSource.getRepository(Permiso),
      sesionRepo: dataSource.getRepository(Sesion),
      dataSource,
      cryptService: app.get(CryptService),
    };

    const endpoints = await ensureEndpoints(deps);
    const adminPerfil = await ensureAdminPerfil(deps, endpoints);
    const adminUser = await ensureAdminUsuario(deps, adminPerfil);
    // eslint-disable-next-line no-console
    console.log(`Usuario admin listo con id=${adminUser.id}`);

    // eslint-disable-next-line no-console
    console.log('Seed de producción completado');
  } catch (error) {
    logger.error('Error al ejecutar seeds de producción', error as Error);
    throw error;
  } finally {
    if (opts.closeApp) {
      await app.close();
    }
  }
}

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule, {
    logger: ['error', 'warn', 'log'],
  });
  try {
    await runProdSeeds(app, { closeApp: true });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Error al ejecutar seeds de producción', error);
    process.exitCode = 1;
  }
}

if (require.main === module) {
  void bootstrap();
}
