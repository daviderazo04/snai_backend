import { Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Endpoint } from '../entities/endpoints.entity';
import { Perfil } from '../entities/perfil.entity';
import { Permiso } from '../entities/permisos.entity';
import { Usuario } from '../entities/usuario.entity';
import { Sesion } from '../entities/sesion.entity';
import { ALL_ENDPOINTS } from '../../common/constants/endpoints';
import { CryptService } from '../../common/crypt.service';
import { ConfigService } from '@nestjs/config';
import { Sexo } from '../../common/enums/sexo.enums';
import { ADMIN_TICS_ENDPOINTS } from '../../common/constants/seed-permissions';

@Injectable()
export class StartupSeedService implements OnApplicationBootstrap {
  private readonly logger = new Logger(StartupSeedService.name);

  constructor(
    @InjectRepository(Endpoint)
    private readonly endpointRepo: Repository<Endpoint>,
    @InjectRepository(Perfil)
    private readonly perfilRepo: Repository<Perfil>,
    @InjectRepository(Permiso)
    private readonly permisoRepo: Repository<Permiso>,
    @InjectRepository(Usuario)
    private readonly usuarioRepo: Repository<Usuario>,
    @InjectRepository(Sesion)
    private readonly sesionRepo: Repository<Sesion>,
    private readonly cryptService: CryptService,
    private readonly configService: ConfigService,
  ) {}

  async onApplicationBootstrap(): Promise<void> {
    try {
      await this.ensureSeedData();
      this.logger.log('Seed inicial verificada/completada');
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Error desconocido';
      this.logger.warn(`No se pudo completar el seed inicial: ${message}`);
    }
  }

  private async ensureSeedData(): Promise<void> {
    const endpoints = await this.ensureEndpoints();
    const adminPerfil = await this.ensureAdminPerfil(endpoints);
    await this.ensureAdminUsuario(adminPerfil);
  }

  private async ensureEndpoints(): Promise<Endpoint[]> {
    const existentes = await this.endpointRepo.find();
    const porRuta = new Map<string, Endpoint>(
      existentes.map((e) => [e.endpoint, e]),
    );
    const result: Endpoint[] = [];

    for (const { endpoint, descripcion } of ALL_ENDPOINTS) {
      const existente = porRuta.get(endpoint);
      if (!existente) {
        const creado = this.endpointRepo.create({ endpoint, descripcion });
        result.push(await this.endpointRepo.save(creado));
        continue;
      }
      if (existente.descripcion !== descripcion) {
        existente.descripcion = descripcion;
        await this.endpointRepo.save(existente);
      }
      result.push(existente);
    }

    return result;
  }

  private async ensureAdminPerfil(endpoints: Endpoint[]): Promise<Perfil> {
    let perfil = await this.perfilRepo.findOne({
      where: { nombre: 'Administrador' },
      relations: ['permisos', 'permisos.endpoint'],
    });

    if (!perfil) {
      perfil = this.perfilRepo.create({
        nombre: 'Administrador',
        descripcion:
          'Gestion de usuarios, perfiles y parametros con permisos completos',
      });
      perfil = await this.perfilRepo.save(perfil);
    }

    const adminEndpointSet = new Set<string>(ADMIN_TICS_ENDPOINTS);
    const permisosExistentes =
      perfil.permisos?.reduce((acc, permiso) => {
        acc.set(permiso.endpoint.endpoint, permiso);
        return acc;
      }, new Map<string, Permiso>()) ?? new Map<string, Permiso>();

    for (const endpoint of endpoints) {
      if (!adminEndpointSet.has(endpoint.endpoint)) continue;
      const permiso = permisosExistentes.get(endpoint.endpoint);
      if (!permiso) {
        await this.permisoRepo.save(
          this.permisoRepo.create({
            endpoint,
            perfil,
            VIEW: true,
            EDIT: true,
          }),
        );
        continue;
      }

      // Asegura permisos completos para los endpoints asignados
      if (!permiso.VIEW || !permiso.EDIT) {
        permiso.VIEW = true;
        permiso.EDIT = true;
        await this.permisoRepo.save(permiso);
      }
    }

    for (const permiso of perfil.permisos ?? []) {
      if (adminEndpointSet.has(permiso.endpoint.endpoint)) continue;
      if (!permiso.VIEW && !permiso.EDIT) continue;
      permiso.VIEW = false;
      permiso.EDIT = false;
      await this.permisoRepo.save(permiso);
    }

    return perfil;
  }

  private async ensureAdminUsuario(perfil: Perfil): Promise<Usuario> {
    const cedula =
      this.configService.get<string>('SEED_ADMIN_CEDULA') ?? '1717171717';
    const correo =
      this.configService.get<string>('SEED_ADMIN_EMAIL') ?? 'admin@snai.local';
    const password =
      this.configService.get<string>('SEED_ADMIN_PASSWORD') ?? 'Admin123!';
    const nombre =
      this.configService.get<string>('SEED_ADMIN_NOMBRE') ?? 'Administrador';
    const apellido =
      this.configService.get<string>('SEED_ADMIN_APELLIDO') ?? 'Tics';

    let usuario = await this.usuarioRepo.findOne({
      where: [{ correo }, { cedula }],
      relations: ['sesiones', 'sesiones.perfil'],
    });

    if (!usuario) {
      const hashed = await this.cryptService.crypt(password);
      usuario = this.usuarioRepo.create({
        cedula,
        correo,
        password: hashed,
        nombre,
        apellido,
        sexo: Sexo.MASCULINO,
        direccion: 'Direccion administrador',
        telefono: '+593000000000',
      });
      usuario = await this.usuarioRepo.save(usuario);
    }

    const tieneSesion = usuario.sesiones?.some(
      (sesion) => sesion.perfil?.id === perfil.id,
    );
    if (!tieneSesion) {
      await this.sesionRepo.save(
        this.sesionRepo.create({
          usuario,
          perfil,
        }),
      );
    }

    return usuario;
  }
}
