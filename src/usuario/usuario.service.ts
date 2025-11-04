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

  async findAll(): Promise<Usuario[]> {
    return this.userRepository.find();
  }

  async findOne(id: number): Promise<Usuario> {
    const usuario = await this.userRepository.findOne({ where: { id } });
    if (!usuario) {
      throw new Error(`Usuario con ID ${id} no encontrado`);
    }
    return usuario;
  }

  async findByCorreo(correo: string): Promise<Usuario | null> {
    return this.userRepository.findOne({ where: { correo } });
  }

  /*  async update(id: number, updateData: any): Promise<Usuario> {
    // Si se está actualizando la contraseña, encriptarla
    if (updateData.contraseña) {
      const newPassword = await this.cryptService.crypt(updateData.password);
      updateData.contraseña = newPassword;
    }

    await this.userRepository.update(id, updateData);
    return this.findOne(id);
  }*/

  async remove(id: number): Promise<void> {
    const usuario = await this.findOne(id);
    await this.userRepository.remove(usuario);
  }
}
