import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UsuarioService } from '../../usuario/services/usuario.service';
import { AuthenticatedRequest } from '../../common/jwt/JWTUser';

@Injectable()
export class PermisosGuard implements CanActivate {
  constructor(
    private readonly usuarioService: UsuarioService,
    private readonly reflector: Reflector,
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

    // Obtener ruta estática (sin params)
    const handler = context.getHandler();
    const controller = context.getClass();

    const controllerPath = this.getPath(controller);
    const handlerPath = this.getPath(handler);

    const rutaEstandar = `/${controllerPath}/${handlerPath}`.replace(
      /\/+/g,
      '/',
    );

    const metodo = req.method;
    console.log(rutaEstandar, metodo);
    const permitido = await this.usuarioService.verficarPermiso(
      user.id,
      rutaEstandar,
      metodo,
    );

    return permitido;
  }

  private getPath(target: unknown): string {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    const raw = Reflect.getMetadata('path', target) as unknown;
    return typeof raw === 'string' ? raw : '';
  }
}
