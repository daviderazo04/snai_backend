import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { AuthenticatedRequest } from '../jwt/JWTUser';
import { Request } from 'express';
import { UsuarioService } from '../../usuario/usuario.service';
import { Reflector } from '@nestjs/core';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private usuarioService: UsuarioService,
    private readonly reflector: Reflector,
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>('isPublic', [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) return true;
    const req = context.switchToHttp().getRequest<AuthenticatedRequest>();

    const user = req.user;
    const metodo = req.method;
    const ruta = req.url;
    if (!user) {
      console.log('no user');
      return false;
    }
    const permitido = await this.usuarioService.verficarPermiso(
      user.id,
      ruta,
      metodo,
    );
    return permitido;
  }
}
