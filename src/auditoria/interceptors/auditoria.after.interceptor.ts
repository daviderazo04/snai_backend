import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuditoriaService } from '../auditoria.service';
import { catchError, Observable, tap, throwError } from 'rxjs';
import { AUDIT_ENTITY_KEY } from '../decorators/auditar.decorator';
import { AuditedRequest } from '../../common/request/AuditedRequest';

@Injectable()
export class AuditoriaAfterInterceptor implements NestInterceptor {
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

    return next.handle().pipe(
      tap(async (response) => {
        try {
          if (shouldCapture) {
            await this.auditoriaService.captureAfterState(
              auditoriaId!,
              entity,
              idEntidad,
            );
          }

          if (auditoriaId) {
            if (isResponseWithData(response)) {
              const { success, message } = response;
              await this.auditoriaService.completeAuditoria(
                auditoriaId,
                success,
                message,
              );
            } else {
              await this.auditoriaService.completeAuditoria(auditoriaId, true);
            }
          }
        } catch (err) {
          console.error(err);
        }
      }),

      catchError((error) => {
        if (auditoriaId) {
          this.auditoriaService
            .saveError(auditoriaId, error.message)
            .then(() =>
              this.auditoriaService.completeAuditoria(
                auditoriaId,
                false,
                error.message,
              ),
            )
            .catch(console.error);
        }

        return throwError(() => error);
      }),
    );
  }
}

function isResponseWithData(
  obj: any,
): obj is { success: boolean; data: any; message?: string } {
  return (
    obj !== null &&
    typeof obj === 'object' &&
    'success' in obj &&
    typeof obj.success === 'boolean' &&
    'data' in obj
  );
}
