import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { DataSource, Repository } from 'typeorm';
import { AppModule } from '../src/app.module';
import { Endpoint } from '../src/usuario/entities/endpoints.entity';
import { Permiso } from '../src/usuario/entities/permisos.entity';
import { Sesion } from '../src/usuario/entities/sesion.entity';
import { Perfil } from '../src/usuario/entities/perfil.entity';
import { Usuario } from '../src/usuario/entities/usuario.entity';

// Para correrlo: configurar DB_* y JWT_SECRET apuntando a una base de pruebas y ejecutar
// npm run test:e2e -- --runTestsByPath test/perfil-flow.e2e-spec.ts

describe('Flujo de perfil (e2e)', () => {
  let app: INestApplication;
  let dataSource: DataSource;
  let endpointRepo: Repository<Endpoint>;
  let permisoRepo: Repository<Permiso>;
  let sesionRepo: Repository<Sesion>;
  let perfilRepo: Repository<Perfil>;
  let usuarioRepo: Repository<Usuario>;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    dataSource = app.get(DataSource);
    endpointRepo = dataSource.getRepository(Endpoint);
    permisoRepo = dataSource.getRepository(Permiso);
    sesionRepo = dataSource.getRepository(Sesion);
    perfilRepo = dataSource.getRepository(Perfil);
    usuarioRepo = dataSource.getRepository(Usuario);
  });

  afterAll(async () => {
    await app.close();
  });

  const clearDatabase = async () => {
    await permisoRepo.createQueryBuilder().delete().execute();
    await sesionRepo.createQueryBuilder().delete().execute();
    await endpointRepo.createQueryBuilder().delete().execute();
    await perfilRepo.createQueryBuilder().delete().execute();
    await usuarioRepo.createQueryBuilder().delete().execute();
  };

  it('registra usuario, inserta endpoints y crea perfil con permisos', async () => {
    await clearDatabase();

    const registerRes = await request(app.getHttpServer())
      .post('/auth/register')
      .send({
        correo: 'perfil.e2e@example.com',
        password: 'Password123!',
        nombre: 'Perfil',
        apellido: 'E2E',
      })
      .expect(201);

    const token = registerRes.body?.data?.accessToken as string;

    // Inserta aquí los endpoints que necesites para las pruebas; puedes añadir o quitar
    const endpointsCreados = await endpointRepo.save([
      endpointRepo.create({ endpoint: '/usuario' }),
      endpointRepo.create({ endpoint: '/perfil' }),
    ]);

    const perfilRes = await request(app.getHttpServer())
      .post('/perfil')
      .set('Authorization', `Bearer ${token}`)
      .send({
        nombre: 'Administrador',
        descripcion: 'Control total de perfiles',
        permisos: endpointsCreados.map((e) => ({
          endpoint: e.endpoint,
          VIEW: true,
          EDIT: true,
        })),
      })
      .expect(201);

    expect(perfilRes.body.success).toBe(true);
    expect(perfilRes.body.data?.id).toBeDefined();

    const perfilCreado: Perfil = perfilRes.body.data;
    const usuarioCreado = await usuarioRepo.findOneByOrFail({
      correo: 'perfil.e2e@example.com',
    });
    await sesionRepo.save(
      sesionRepo.create({ usuario: usuarioCreado, perfil: perfilCreado }),
    );

    const permisosEnDb = await permisoRepo.find({
      relations: ['endpoint', 'perfil'],
    });
    expect(permisosEnDb).toHaveLength(endpointsCreados.length);
    expect(permisosEnDb.map((p) => p.endpoint.endpoint).sort()).toEqual(
      endpointsCreados.map((e) => e.endpoint).sort(),
    );

    // Verifica que el endpoint protegido responda distinto a 403/404 (esperamos 200)
    const usuariosRes = await request(app.getHttpServer())
      .get('/usuario')
      .set('Authorization', `Bearer ${token}`);

    expect([403, 404]).not.toContain(usuariosRes.status);
    expect(usuariosRes.status).toBe(200);
  });
});
