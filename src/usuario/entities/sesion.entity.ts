import { Entity, ManyToOne, PrimaryGeneratedColumn, JoinColumn } from 'typeorm';
import { Perfil } from './perfil.entity';
import { Usuario } from './usuario.entity';

@Entity()
export class Sesion {
  @PrimaryGeneratedColumn()
  id: number;
  @ManyToOne(() => Perfil, (perfil) => perfil.sesiones)
  @JoinColumn({ name: 'perfilId' })
  perfil: Perfil;
  @ManyToOne(() => Usuario, (usuario) => usuario.sesiones)
  @JoinColumn({ name: 'usuarioId' })
  usuario: Usuario;
}
