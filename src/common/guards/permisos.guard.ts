import {
  CanActivate,
  ExecutionContext,
  Injectable,
  Logger,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UsuarioService } from '../../usuario/services/usuario.service';
import { AuthenticatedRequest } from '../jwt/JWTUser';
import { AuditoriaService } from '../../auditoria/auditoria.service';
import { AuditedRequest } from '../request/AuditedRequest';

@Injectable()
export class PermisosGuard implements CanActivate {
  private readonly logger = new Logger(PermisosGuard.name);

  constructor(
    private readonly usuarioService: UsuarioService,
    private readonly reflector: Reflector,
    private readonly auditoriaService: AuditoriaService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>('isPublic', [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) return true;

    const req: AuthenticatedRequest = context
      .switchToHttp()
      .getRequest<AuthenticatedRequest>();
    const user = req.user;

    if (!user) return false;
    if (!user.perfilActivo) return false;
    const rutaEstandar = this.normalizePath(context, req);
    const metodo = req.method;
    const permitido = await this.usuarioService.verficarPermiso(
      user.id,
      rutaEstandar,
      metodo,
      user.perfilActivo.id,
    );

    this.logger.log(
      `auth route=${rutaEstandar} method=${metodo} perfil=(${user.perfilActivo.nombre},${user.perfilActivo.id}) allowed=${permitido}`,
    );
    const rutaAuditoria = this.getAuditPath(req);
    const idAuditable = await this.auditoriaService.createAuditoria(
      user.id,
      rutaAuditoria,
      metodo,
      permitido,
      JSON.stringify(req.body),
    );
    const auditedReq = context.switchToHttp().getRequest<AuditedRequest>();
    auditedReq.id = idAuditable;
    return permitido;
  }

  private getPath(target: unknown): string {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    const raw = Reflect.getMetadata('path', target) as unknown;
    return typeof raw === 'string' ? raw : '';
  }

  private normalizePath(
    context: ExecutionContext,
    req: AuthenticatedRequest,
  ): string {
    // Preferimos la ruta que Express resolvió (incluye params como "/:id")
    const baseUrl = req.baseUrl ?? '';
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment,@typescript-eslint/no-unsafe-member-access
    const routePath = req.route?.path ?? '';

    let combined = `${baseUrl}${routePath}`;

    // Si no hay routePath (caso raro), construimos con metadatos y
    // tratamos el último segmento numérico como ":id"
    if (!routePath) {
      const controllerPath = this.getPath(context.getClass());
      const handlerPath = this.getPath(context.getHandler());
      combined = `/${controllerPath}/${handlerPath}`;

      const noQuery = (req.path ?? '').split('?')[0] ?? combined;
      const segments = noQuery.split('/').filter(Boolean);
      if (segments.length > 0) {
        const last = segments[segments.length - 1];
        if (/^[0-9]+$/.test(last)) {
          segments[segments.length - 1] = ':id';
        }
        combined = `/${segments.join('/')}`;
      }
    }

    // Limpia dobles slashes y quita trailing slash
    combined = combined.replace(/\/+/g, '/').replace(/\/$/, '') || '/';

    // Elimina segmentos numéricos o dinámicos (p. ej. :id) para que /provincias/:id y /provincias/2 se traten igual
    const cleanedSegments = combined
      .split('/')
      .filter(Boolean)
      .filter(
        (segment) => !segment.startsWith(':') && !/^[0-9]+$/.test(segment),
      );

    return cleanedSegments.length > 0 ? `/${cleanedSegments.join('/')}` : '/';
  }

  private getAuditPath(req: AuthenticatedRequest): string {
    const raw = (req.originalUrl ?? req.url ?? '').trim();
    return raw || '/';
  }
}
