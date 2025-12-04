import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuditoriaService } from '../auditoria.service';
import { Observable } from 'rxjs';
import { AUDIT_ENTITY_KEY } from '../decorators/auditar.decorator';
import { AuditedRequest } from '../../common/request/AuditedRequest';

@Injectable()
export class AuditoriaBeforeInterceptor implements NestInterceptor {
  constructor(
    private readonly reflector: Reflector,
    private readonly auditoriaService: AuditoriaService,
  ) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const req = context.switchToHttp().getRequest<AuditedRequest>();

    const entity = this.reflector.get(AUDIT_ENTITY_KEY, context.getHandler());
    const idEntidad = Number(req?.id);
    const auditoriaId = req.id;

    if (entity && idEntidad && auditoriaId) {
      this.auditoriaService
        .captureBeforeState(auditoriaId, entity, idEntidad)
        .catch(console.error);
    }

    return next.handle();
  }
}
