import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsuarioService } from '../usuario/services/usuario.service';
import { RegisterPayloadDto } from './dto/register.payload.dto';
import { CryptService } from '../common/crypt.service';
import { Usuario } from '../usuario/entities/usuario.entity';
import { LoginPayloadDto } from './dto/login.payload.dto';
import { ResultWithData } from '../common/dto/result.dto';
import { LoginResponseData } from './dto/login.response.data';
import * as JWTUser from '../common/jwt/JWTUser';
import { JwtUser } from '../common/jwt/JWTUser';
import { PerfilDto } from './dto/perfil.dto';
import { RolesService } from '../usuario/services/roles.service';
import { Estado } from '../common/enums/estado.enum';

@Injectable()
export class AuthService {
  constructor(
    private usuarioService: UsuarioService,
    private roleService: RolesService,
    private cryptService: CryptService,
    private jwtService: JwtService,
  ) {}
  private generateToken(user: Usuario, perfil?: PerfilDto): string {
    const payload = new JwtUser(user, perfil);
    const access_token = this.jwtService.sign(payload.toPlainObject());
    return access_token;
  }
  async validateUser(
    cedula: string,
    password: string,
  ): Promise<Usuario | null> {
    const user = await this.usuarioService.findByCedula(cedula);
    if (user == null) return null;
    if (await this.cryptService.compare(password, user.password)) {
      return user;
    }
    return null;
  }
  async gainAccess(
    user: JWTUser.JwtUser,
    payload: PerfilDto,
  ): Promise<ResultWithData<LoginResponseData>> {
    const perfilesDisponibles = await this.usuarioService.getPerfiles(user.id);
    const autorizado = perfilesDisponibles.some(
      (perfil) => perfil.id === payload.id,
    );
    if (!autorizado)
      return new ResultWithData<LoginResponseData>(
        false,
        'No tiene autorizacion para usar este perfil',
        null,
      );
    const permisos = await this.roleService.getFlatPermisosDePerfil(payload.id);
    const authUser = await this.usuarioService.getUsuarioById(user.id);
    const access_token = this.generateToken(authUser!, payload);
    return new ResultWithData<LoginResponseData>(
      true,
      'Acceso concedido',
      new LoginResponseData(
        access_token,
        new JwtUser(authUser!, payload),
        perfilesDisponibles,
        permisos,
      ),
    );
  }
  async login(
    loginDto: LoginPayloadDto,
  ): Promise<ResultWithData<LoginResponseData>> {
    const user = await this.validateUser(loginDto.cedula, loginDto.password);
    if (!user) {
      return new ResultWithData<LoginResponseData>(
        false,
        'Credenciales incorrectas',
        null,
      );
    }
    if (user.estado == Estado.INACTIVO) {
      return new ResultWithData<LoginResponseData>(
        false,
        'Su usuario ha sido desactivado',
        null,
      );
    }
    const access_token = this.generateToken(user);
    const permisos = await this.usuarioService.getPerfiles(user.id);
    return new ResultWithData<LoginResponseData>(
      true,
      'Login exitoso',
      new LoginResponseData(access_token, new JwtUser(user), permisos),
    );
  }

  async register(
    userData: RegisterPayloadDto,
  ): Promise<ResultWithData<LoginResponseData>> {
    // Verificar si el usuario ya existe
    const existingCedula = await this.usuarioService.findByCedula(
      userData.cedula,
    );
    if (existingCedula) {
      return new ResultWithData<LoginResponseData>(
        false,
        'Registro fallido: la cédula ya se encuentra registrada',
        null,
      );
    }
    const existingCorreo = await this.usuarioService.findByCorreo(
      userData.correo,
    );
    if (existingCorreo) {
      return new ResultWithData<LoginResponseData>(
        false,
        'Registro fallido: el correo ya se encuentra registrado',
        null,
      );
    }

    const newUser = await this.usuarioService.create(userData);

    const access_token = this.generateToken(newUser);

    return new ResultWithData<LoginResponseData>(
      true,
      'Registro exitoso',
      new LoginResponseData(access_token, new JwtUser(newUser), []),
    );
  }
}
