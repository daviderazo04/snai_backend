import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsuarioService } from '../usuario/services/usuario.service';
import { RegisterPayloadDto } from './dto/register.payload.dto';
import { CryptService } from '../common/crypt.service';
import { Usuario } from '../usuario/entities/usuario.entity';
import { LoginPayloadDto } from './dto/login.payload.dto';
import { ResultWithData } from '../common/dto/result.dto';
import { LoginResponseData } from './dto/login.response.data';
import { JwtUser } from '../common/jwt/JWTUser';
import { use } from 'passport';

@Injectable()
export class AuthService {
  constructor(
    private usuarioService: UsuarioService,
    private cryptService: CryptService,
    private jwtService: JwtService,
  ) {}
  private generateToken(user: Usuario): string {
    const payload = new JwtUser(user);
    const access_token = this.jwtService.sign(payload.toPlainObject());
    return access_token;
  }
  async validateUser(
    correo: string,
    password: string,
  ): Promise<Usuario | null> {
    const user = await this.usuarioService.findByCorreo(correo);
    if (user == null) return null;
    if (await this.cryptService.compare(password, user.password)) {
      return user;
    }
    return null;
  }

  async login(
    loginDto: LoginPayloadDto,
  ): Promise<ResultWithData<LoginResponseData>> {
    const user = await this.validateUser(loginDto.correo, loginDto.password);
    if (!user) {
      return new ResultWithData<LoginResponseData>(
        false,
        'Credenciales incorrectas',
        null,
      );
    }

    const access_token = this.generateToken(user);

    return new ResultWithData<LoginResponseData>(
      true,
      'Registro exitoso',
      new LoginResponseData(access_token, new JwtUser(user)),
    );
  }

  async register(
    userData: RegisterPayloadDto,
  ): Promise<ResultWithData<LoginResponseData>> {
    // Verificar si el usuario ya existe
    const existingUser = await this.usuarioService.findByCorreo(
      userData.correo,
    );
    if (existingUser) {
      return new ResultWithData<LoginResponseData>(
        false,
        'Registro fallido',
        null,
      );
    }

    const newUser = await this.usuarioService.create(userData);

    const access_token = this.generateToken(newUser);

    return new ResultWithData<LoginResponseData>(
      true,
      'Registro exitoso',
      new LoginResponseData(access_token, new JwtUser(newUser)),
    );
  }
}
