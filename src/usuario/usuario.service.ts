import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Usuario } from './entities/usuario.entity';
import * as bcrypt from 'bcrypt';
import { RegisterPayloadDto } from '../auth/dto/register.payload.dto';
import { CryptService } from '../common/crypt.service';

@Injectable()
export class UsuarioService {
  constructor(
    private cryptService: CryptService,
    @InjectRepository(Usuario)
    private userRepository: Repository<Usuario>,
  ) {}

  async create(data: RegisterPayloadDto): Promise<Usuario> {
    try {
      const hashedPassword: string = await this.cryptService.crypt(
        data.password,
      );

      const nuevoUsuario = this.userRepository.create({
        ...data,
        password: hashedPassword,
      });

      const usuarioGuardado = await this.userRepository.save(nuevoUsuario);

      return usuarioGuardado;
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async findOne(id: number): Promise<Usuario> {
    const usuario = await this.userRepository.findOne({ where: { id } });
    if (!usuario) {
      throw new Error(`Usuario con ID ${id} no encontrado`);
    }
    return usuario;
  }

  async verficarPermiso(userId: number, endpoint: string, metodo: string) {
    const view_req = metodo == 'GET';
    const edit_req =
      metodo == 'POST' ||
      metodo == 'PATCH' ||
      metodo == 'PUT' ||
      metodo == 'DELETE';
    const data = await this.userRepository
      .createQueryBuilder('u')
      .select('e.endpoint', 'endpoint')
      .addSelect('BOOL_OR(pe."EDIT")', 'EDIT')
      .addSelect('BOOL_OR(pe."VIEW")', 'VIEW')
      .innerJoin('sesion', 's', 'u.id = s."usuarioId"')
      .innerJoin('perfil', 'p', 'p.id = s."perfilId"')
      .innerJoin('permiso', 'pe', 'pe."perfilId" = p.id')
      .innerJoin('endpoint', 'e', 'e.id = pe."endpointId"')
      .where('u.id = :userId', { userId })
      .andWhere('e.endpoint = :endpoint', { endpoint })
      .groupBy('e.endpoint')
      .getRawOne();
    console.log(data);
    if (!data) return false;

    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    if (edit_req && data.EDIT) {
      return true;
    }
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    if (view_req && data.VIEW) {
      return true;
    }
    return false;
  }

  async findByCorreo(correo: string): Promise<Usuario | null> {
    return this.userRepository.findOne({ where: { correo } });
  }
}
