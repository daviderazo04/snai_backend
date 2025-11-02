import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsuarioService } from '../usuario/usuario.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private usuarioService: UsuarioService,
    private jwtService: JwtService,
  ) {}

  async validateUser(correo: string, password: string): Promise<any> {
    const user = await this.usuarioService.findByCorreo(correo);
    if (user && await bcrypt.compare(password, user.contraseña)) {
      const { contraseña, ...result } = user;
      return result;
    }
    return null;
  }

  async login(correo: string, password: string) {
    const user = await this.validateUser(correo, password);
    if (!user) {
      throw new UnauthorizedException('Credenciales inválidas');
    }
    
    const payload = { 
      correo: user.correo, 
      sub: user.id,
      nombre: user.nombre,
      apellido: user.apellido
    };
    
    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        correo: user.correo,
        nombre: user.nombre,
        apellido: user.apellido
      }
    };
  }

  async register(userData: any) {
    // Verificar si el usuario ya existe
    const existingUser = await this.usuarioService.findByCorreo(userData.correo);
    if (existingUser) {
      throw new UnauthorizedException('El usuario ya existe');
    }

    // Crear nuevo usuario (la contraseña se encripta en el servicio)
    const newUser = await this.usuarioService.create(userData);
    
    // Generar token
    const payload = { 
      correo: newUser.correo, 
      sub: newUser.id,
      nombre: newUser.nombre,
      apellido: newUser.apellido
    };

    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: newUser.id,
        correo: newUser.correo,
        nombre: newUser.nombre,
        apellido: newUser.apellido
      }
    };
  }
}