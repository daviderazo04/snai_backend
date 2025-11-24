import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { Perfil } from './entities/perfil.entity';
import { PerfilPayloadDto } from './dto/perfil.payload.dto';
import { Permiso } from './entities/permisos.entity';
import { Endpoint } from './entities/endpoints.entity';
import { SimpleResult } from '../common/dto/result.dto';

@Injectable()
export class RolesService {
  constructor(private readonly dataSource: DataSource) {}
  async createPerfil(payload: PerfilPayloadDto): Promise<SimpleResult> {
    const result = await this.dataSource.transaction(async (manager) => {
      try {
        const newPerfil = manager.create(Perfil, {
          nombre: payload.nombre,
          descripcion: payload.descripcion,
        });
        await manager.save(Perfil, newPerfil);
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
        }
        return new SimpleResult(true, 'Perfil creado correctamente');
      } catch (e) {
        const err = e as Error;
        return new SimpleResult(false, 'Error al crear perfil:' + err.message);
      }
    });
    return result;
  }
}
