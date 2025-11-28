import { INestApplication } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { Endpoint } from '../usuario/entities/endpoints.entity';
import { Perfil } from '../usuario/entities/perfil.entity';
import { Permiso } from '../usuario/entities/permisos.entity';
import { Usuario } from '../usuario/entities/usuario.entity';
import { Sesion } from '../usuario/entities/sesion.entity';
import { Sexo } from '../common/enums/sexo.enums';
import { CryptService } from '../common/crypt.service';

type SeedDeps = {
  endpointRepo: Repository<Endpoint>;
  perfilRepo: Repository<Perfil>;
  permisoRepo: Repository<Permiso>;
  dataSource: DataSource;
  cryptService: CryptService;
  sesionRepo: Repository<Sesion>;
};

const ENDPOINTS = [
  '/auth/login',
  '/auth/register',
  '/auth/profile',
  '/auth/perfil',
  '/usuario',
  '/usuario/perfil',
  '/perfil',
  '/perfil/:id',
  '/localidades',
  '/localidades/provincia',
  '/localidades/canton',
];

async function ensureEndpoints(deps: SeedDeps) {
  for (const path of ENDPOINTS) {
    const existing = await deps.endpointRepo.findOneBy({ endpoint: path });
    if (existing) continue;
    await deps.endpointRepo.save(deps.endpointRepo.create({ endpoint: path }));
  }
  return deps.endpointRepo.find();
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

  const [found] = await deps.dataSource.query(
    `SELECT id FROM "usuario" WHERE correo = $1 LIMIT 1`,
    [correo],
  );

  let usuarioId: number;
  if (!found) {
    const hashed = await deps.cryptService.crypt(password);
    const colNames = ['correo', 'password', 'nombre', 'apellido'];
    const values: unknown[] = [correo, hashed, nombre, apellido];

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
  } else {
    usuarioId = found.id as number;
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
  }

  return deps.dataSource.getRepository(Usuario).create({ id: usuarioId });
}

export async function runProdSeed(app: INestApplication) {
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
  await ensureAdminUsuario(deps, adminPerfil);
}
