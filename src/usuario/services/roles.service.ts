import { Injectable } from '@nestjs/common';
import { DataSource, ILike, Repository } from 'typeorm';
import { Perfil } from '../entities/perfil.entity';
import { PerfilPayloadDto } from '../dto/perfil.payload.dto';
import { Permiso } from '../entities/permisos.entity';
import { Endpoint } from '../entities/endpoints.entity';
import { ResultWithData, SimpleResult } from '../../common/dto/result.dto';
import { PerfilUpdatePayloadDto } from '../dto/perfil.update.payload.dto';
import { PaginatedResult } from '../../common/dto/paginated.result.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { PerfilAsignarPayload } from '../dto/perfil.asignar.payload.dto';
import { Usuario } from '../entities/usuario.entity';
import { Sesion } from '../entities/sesion.entity';

@Injectable()
export class RolesService {
  constructor(
    private readonly dataSource: DataSource,
    @InjectRepository(Perfil)
    private readonly perfilesRepository: Repository<Perfil>,
  ) {}
  async updatePerfil(
    id: number,
    payload: PerfilUpdatePayloadDto,
  ): Promise<ResultWithData<Perfil>> {
    const result = await this.dataSource.transaction(async (manager) => {
      try {
        const actualPerfil = await manager.findOneBy(Perfil, { id });
        if (!actualPerfil) {
          throw new Error(`Perfil con ID ${id} no encontrado`);
        }
        if (payload.nombre) {
          actualPerfil.nombre = payload.nombre;
        }
        if (payload.descripcion) {
          actualPerfil.descripcion = payload.descripcion;
        }
        await manager.save(actualPerfil);
        for (const permiso of payload.permisosEditados) {
          const actualEndpoint = await manager.findOneBy(Endpoint, {
            endpoint: permiso.endpoint,
          });
          if (!actualEndpoint) {
            throw new Error(`Endpoint ${permiso.endpoint} no encontrado`);
          }
          const nuevoPermiso = manager.create(Permiso, {
            endpoint: actualEndpoint,
            perfil: actualPerfil,
            EDIT: permiso.EDIT,
            VIEW: permiso.VIEW,
          });
          await manager.save(nuevoPermiso);
        }
        return new ResultWithData<Perfil>(
          true,
          'Perfil actualizado correctamente',
          actualPerfil,
        );
      } catch (e) {
        const err = e as Error;
        return new ResultWithData<Perfil>(
          false,
          'Error al actualizar perfil:' + err.message,
          null,
        );
      }
    });
    return result;
  }
  async createPerfil(
    payload: PerfilPayloadDto,
  ): Promise<ResultWithData<Perfil>> {
    const result = await this.dataSource.transaction(async (manager) => {
      try {
        const newPerfil = manager.create(Perfil, {
          nombre: payload.nombre,
          descripcion: payload.descripcion,
        });
        await manager.save(Perfil, newPerfil);
        let endpointsRestantes = await manager.find(Endpoint);
        for (const permiso of payload.permisos) {
          const endpointReal = await manager.findOneBy(Endpoint, {
            endpoint: permiso.endpoint,
          });
          if (!endpointReal) {
            throw new Error(`Endpoint ${permiso.endpoint} no encontrado`);
          }
          const nuevoPermiso = manager.create(Permiso, {
            endpoint: endpointReal,
            perfil: newPerfil,
            EDIT: permiso.EDIT,
            VIEW: permiso.VIEW,
          });
          await manager.save(Permiso, nuevoPermiso);
          endpointsRestantes = endpointsRestantes.filter(
            (e) => e.endpoint != permiso.endpoint,
          );
        }
        for (const endpoint of endpointsRestantes) {
          const nuevoPermiso = manager.create(Permiso, {
            endpoint: endpoint,
            perfil: newPerfil,
            EDIT: false,
            VIEW: false,
          });
          await manager.save(Permiso, nuevoPermiso);
        }
        return new ResultWithData<Perfil>(
          true,
          'Perfil creado correctamente',
          newPerfil,
        );
      } catch (e) {
        const err = e as Error;
        return new ResultWithData<Perfil>(
          false,
          'Error al crear perfil:' + err.message,
          null,
        );
      }
    });
    return result;
  }
  async asignarPerfil(
    id: number,
    payload: PerfilAsignarPayload,
  ): Promise<SimpleResult> {
    const result = await this.dataSource.transaction(async (manager) => {
      try {
        const usuario = await manager.findOneBy(Usuario, { id });
        if (!usuario) {
          throw new Error(`Usuario con ID ${id} no encontrado`);
        }
        for (const perfilId of payload.perfiles) {
          const perfil = await manager.findOneBy(Perfil, { id: perfilId });
          if (!perfil) {
            throw new Error(`Perfil con ID ${perfilId} no encontrado`);
          }
          const nuevoSesion = manager.create(Sesion, {
            usuario: usuario,
            perfil: perfil,
          });
          await manager.save(nuevoSesion);
        }
        return new SimpleResult(true, 'Perfil asignado correctamente');
      } catch (e) {
        const err = e as Error;
        return new SimpleResult(
          false,
          'Error al asignar perfil:' + err.message,
        );
      }
    });
    return result;
  }
  async getPerfiles(
    nombre: string = '',
    page: number = 1,
    size: number = 10,
  ): Promise<PaginatedResult<Perfil>> {
    const skip = (page - 1) * size;
    if (nombre == '') {
      const [perfiles, totales] = await this.perfilesRepository.findAndCount({
        take: size,
        skip: skip,
      });
      const totalPages = Math.ceil(totales / size);

      return new PaginatedResult(perfiles, totalPages, page, size);
    } else {
      const [perfiles, totales] = await this.perfilesRepository.findAndCount({
        where: { nombre: ILike(`%${nombre}%`) },
        take: size,
        skip: skip,
      });
      const totalPages = Math.ceil(totales / size);

      return new PaginatedResult(perfiles, totalPages, page, size);
    }
  }
}
