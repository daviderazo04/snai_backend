import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Usuario } from '../entities/usuario.entity';
import { RegisterPayloadDto } from '../../auth/dto/register.payload.dto';
import { CryptService } from '../../common/crypt.service';
import { PaginatedResult } from '../../common/dto/paginated.result.dto';
import { ILike } from 'typeorm';
import { PerfilDto } from '../../auth/dto/perfil.dto';
import { Perfil } from '../entities/perfil.entity';
import {
  PerfilFlatResponseDto,
  PermisoFlatResponseDto,
  UsuarioWithPerfilFlatResponseDto,
} from '../dto/permiso.flat.response.dto';
import { ResultWithData } from '../../common/dto/result.dto';
import { RolesService } from './roles.service';

@Injectable()
export class UsuarioService {
  constructor(
    private cryptService: CryptService,
    @InjectRepository(Usuario)
    private userRepository: Repository<Usuario>,
    private rolesService: RolesService,
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

  async verficarPermiso(
    userId: number,
    endpoint: string,
    metodo: string,
    perfilId: number,
  ) {
    const view_req = metodo == 'GET';
    const edit_req =
      metodo == 'POST' ||
      metodo == 'PATCH' ||
      metodo == 'PUT' ||
      metodo == 'DELETE';
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
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
      .andWhere('p."id" = :perfilId', { perfilId })
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

  async findByCedula(cedula: string): Promise<Usuario | null> {
    return this.userRepository.findOne({ where: { cedula: cedula } });
  }

  async findByCorreo(correo: string): Promise<Usuario | null> {
    return this.userRepository.findOne({ where: { correo: correo } });
  }
  async getSanitizedUsuarios(
    nombre: string = '',
    page: number = 1,
    size: number = 10,
  ) {
    const skip = (page - 1) * size;
    if (nombre == '') {
      const [perfiles, totales] = await this.userRepository.findAndCount({
        select: [
          'id',
          'apellido',
          'estado',
          'nombre',
          'correo',
          'estado',
          'createdAt',
          'updatedAt',
        ],
        take: size,
        skip: skip,
      });
      const totalPages = Math.ceil(totales / size);
      return new PaginatedResult(perfiles, totalPages, page, size);
    } else {
      const [perfiles, totales] = await this.userRepository.findAndCount({
        select: [
          'id',
          'apellido',
          'estado',
          'nombre',
          'correo',
          'estado',
          'createdAt',
          'updatedAt',
        ],
        where: { nombre: ILike(`%${nombre}%`) },
        take: size,
        skip: skip,
      });
      const totalPages = Math.ceil(totales / size);

      return new PaginatedResult(perfiles, totalPages, page, size);
    }
  }
  async getUsuarioById(id: number): Promise<Usuario | null> {
    return this.userRepository.findOne({ where: { id } });
  }
  async getUsuarioWithPerfiles(
    id: number,
  ): Promise<ResultWithData<UsuarioWithPerfilFlatResponseDto>> {
    const usuario = await this.userRepository.findOne({
      where: { id },
      relations: ['sesiones', 'sesiones.perfil'],
    });
    if (usuario == null)
      return new ResultWithData<UsuarioWithPerfilFlatResponseDto>(
        false,
        'Usuario no encontrado',
        null,
      );
    const perfiles: Array<PerfilFlatResponseDto> = [];
    for (const session of usuario.sesiones) {
      const flatPerfil = await this.rolesService.getFlatPermisosResultData(
        session.perfil.id,
      );
      perfiles.push(flatPerfil.data!);
    }
    return new ResultWithData<UsuarioWithPerfilFlatResponseDto>(
      true,
      'Usuario obtenido correctamente',
      new UsuarioWithPerfilFlatResponseDto(usuario, perfiles),
    );
  }
  async getPerfiles(userId: number): Promise<PerfilDto[]> {
    const usuario = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['sesiones', 'sesiones.perfil'],
    });
    const perfiles: PerfilDto[] = [];
    usuario?.sesiones.forEach((sesion) => {
      const perfil = new PerfilDto(sesion.perfil.id, sesion.perfil.nombre);
      perfiles.push(perfil);
    });
    return perfiles;
  }
  async checkPerfil(userId: number, perfilId: number): Promise<boolean> {
    const perfiles = await this.getPerfiles(userId);
    return perfiles.some((perfil) => perfil.id == perfilId);
  }
}
