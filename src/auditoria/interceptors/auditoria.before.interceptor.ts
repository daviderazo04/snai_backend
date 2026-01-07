import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuditoriaService } from '../auditoria.service';
import { Observable, from, switchMap } from 'rxjs';
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
    const idEntidad = Number(req?.params?.id);
    const auditoriaId = req.auditoriaId;
    const shouldCapture =
      Boolean(entity) && Number.isFinite(idEntidad) && Boolean(auditoriaId);

    const beforeState = shouldCapture
      ? this.auditoriaService
          .captureBeforeState(auditoriaId!, entity, idEntidad)
          .catch((err) => {
            // No interrumpir la petición si la auditoría falla

            console.error(err);
          })
      : Promise.resolve();

    return from(beforeState).pipe(switchMap(() => next.handle()));
  }
}
