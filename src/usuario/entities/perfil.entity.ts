import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Permiso } from './permisos.entity';
import { Sesion } from './sesion.entity';

@Entity()
export class Perfil {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  nombre: string;
  @Column()
  descripcion: string;
  @OneToMany(() => Permiso, (permiso) => permiso.perfil)
  permisos: Permiso[];
  @OneToMany(() => Sesion, (sesion) => sesion.perfil)
  sesiones: Sesion[];
}
