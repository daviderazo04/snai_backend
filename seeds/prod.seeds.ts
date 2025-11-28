import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from '../src/app.module';
import { DataSource, Repository } from 'typeorm';
import { Endpoint } from '../src/usuario/entities/endpoints.entity';
import { Perfil } from '../src/usuario/entities/perfil.entity';
import { Permiso } from '../src/usuario/entities/permisos.entity';
import { Usuario } from '../src/usuario/entities/usuario.entity';
import { Sesion } from '../src/usuario/entities/sesion.entity';
import { UsuarioService } from '../src/usuario/services/usuario.service';
import { Sexo } from '../src/common/enums/sexo.enums';

type SeedDeps = {
  endpointRepo: Repository<Endpoint>;
  perfilRepo: Repository<Perfil>;
  permisoRepo: Repository<Permiso>;
  sesionRepo: Repository<Sesion>;
  usuarioService: UsuarioService;
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
  const createdOrFound: Endpoint[] = [];
  for (const path of ENDPOINTS) {
    const existing = await deps.endpointRepo.findOneBy({ endpoint: path });
    if (existing) {
      createdOrFound.push(existing);
      continue;
    }
    const nuevo = deps.endpointRepo.create({ endpoint: path });
    const saved = await deps.endpointRepo.save(nuevo);
    createdOrFound.push(saved);
    // eslint-disable-next-line no-console
    console.log(`Endpoint creado: ${path}`);
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
  const correo = process.env.SEED_ADMIN_EMAIL ?? 'admin@snai.local';
  const password = process.env.SEED_ADMIN_PASSWORD ?? 'Admin123!';
  const nombre = process.env.SEED_ADMIN_NOMBRE ?? 'Admin';
  const apellido = process.env.SEED_ADMIN_APELLIDO ?? 'SNIA';

  let usuario = await deps.usuarioService.findByCorreo(correo);
  if (!usuario) {
    usuario = await deps.usuarioService.create({
      correo,
      password,
      nombre,
      apellido,
      sexo: Sexo.MASCULINO,
      direccion: 'Direccion administrador',
      telefono: '+593000000000',
    });
    // eslint-disable-next-line no-console
    console.log(`Usuario administrador creado: ${correo}`);
  } else {
    // eslint-disable-next-line no-console
    console.log(`Usuario administrador ya existe: ${correo}`);
  }

  const sesionExistente = await deps.sesionRepo.findOne({
    where: { usuario: { id: usuario.id }, perfil: { id: perfil.id } },
    relations: ['usuario', 'perfil'],
  });
  if (!sesionExistente) {
    await deps.sesionRepo.save(
      deps.sesionRepo.create({ usuario, perfil: perfil }),
    );
    // eslint-disable-next-line no-console
    console.log('Perfil Administrador asignado al usuario administrador');
  }

  return usuario;
}

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule, {
    logger: ['error', 'warn', 'log'],
  });
  try {
    const dataSource = app.get(DataSource);
    const deps: SeedDeps = {
      endpointRepo: dataSource.getRepository(Endpoint),
      perfilRepo: dataSource.getRepository(Perfil),
      permisoRepo: dataSource.getRepository(Permiso),
      sesionRepo: dataSource.getRepository(Sesion),
      usuarioService: app.get(UsuarioService),
    };

    const endpoints = await ensureEndpoints(deps);
    const adminPerfil = await ensureAdminPerfil(deps, endpoints);
    await ensureAdminUsuario(deps, adminPerfil);

    // eslint-disable-next-line no-console
    console.log('Seed de producción completado');
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Error al ejecutar seeds de producción', error);
    process.exitCode = 1;
  } finally {
    await app.close();
  }
}

void bootstrap();
