import { Injectable } from '@nestjs/common';
import { DataSource, EntityTarget, ObjectLiteral, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Auditoria } from './entities/auditoria.entity';

@Injectable()
export class AuditoriaService {
  constructor(
    @InjectRepository(Auditoria)
    private readonly auditoriaRepo: Repository<Auditoria>,
    private readonly dataSource: DataSource,
  ) {}

  async createAuditoria(
    userId: number,
    endpoint: string,
    metodo: string,
    permitido: boolean,
    payload?: string,
  ): Promise<number> {
    const auditoria = this.auditoriaRepo.create({
      usuario: { id: userId },
      endpoint,
      metodo,
      permitido,
      payload,
    });

    await this.auditoriaRepo.save(auditoria);
    return auditoria.id;
  }
  async completeAuditoria(
    auditoriaId: number,
    sucess: boolean,
    errorMessage?: string,
  ) {
    const auditoria = await this.auditoriaRepo.findOneBy({ id: auditoriaId });
    auditoria!.completado = sucess;
    if (!sucess && errorMessage) {
      auditoria!.error = errorMessage;
    }
    await this.auditoriaRepo.save(auditoria!);
  }

  async captureBeforeState<T extends ObjectLiteral>(
    auditoriaId: number,
    entity: EntityTarget<T>,
    idEntidad: number,
  ) {
    const repo = this.dataSource.getRepository<T>(entity);
    const beforeData = await repo.findOne({
      where: { id: idEntidad } as any,
    });

    await this.auditoriaRepo.update(auditoriaId, {
      antes: JSON.stringify(beforeData ?? {}),
    });
  }

  async captureAfterState<T extends ObjectLiteral>(
    auditoriaId: number,
    entity: EntityTarget<T>,
    idEntidad: number,
  ) {
    const repo = this.dataSource.getRepository<T>(entity);
    const afterData = await repo.findOne({
      where: { id: idEntidad } as any,
    });

    await this.auditoriaRepo.update(auditoriaId, {
      despues: JSON.stringify(afterData ?? {}),
    });
  }

  async saveError(auditoriaId: number, mensaje: string) {
    await this.auditoriaRepo.update(auditoriaId, {
      error: mensaje,
    });
  }
}
