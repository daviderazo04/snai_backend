import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Usuario } from './entities/usuario.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsuarioService {
  constructor(
    @InjectRepository(Usuario)
    private userRepository: Repository<Usuario>,
  ) {}

  async create(data: any): Promise<Usuario> {
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(data.contraseña, salt);

    const nuevoUsuario = this.userRepository.create({
      ...data,
      contraseña: hashedPassword,
    });
    
    const usuarioGuardado = await this.userRepository.save(nuevoUsuario);
    
    // Si save() devuelve un array, tomamos el primer elemento
    return Array.isArray(usuarioGuardado) ? usuarioGuardado[0] : usuarioGuardado;
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

  async update(id: number, updateData: any): Promise<Usuario> {
    // Si se está actualizando la contraseña, encriptarla
    if (updateData.contraseña) {
      const salt = await bcrypt.genSalt();
      updateData.contraseña = await bcrypt.hash(updateData.contraseña, salt);
    }

    await this.userRepository.update(id, updateData);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    const usuario = await this.findOne(id);
    await this.userRepository.remove(usuario);
  }
}
