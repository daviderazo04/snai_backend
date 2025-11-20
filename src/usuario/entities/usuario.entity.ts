import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { Estado } from '../../common/internalClasses/estado.enum';
import { Sesion } from './sesion.entity';

@Entity()
export class Usuario {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  nombre: string;
  @Column()
  apellido: string;
  @Column({ unique: true })
  correo: string;
  @Column()
  password: string;
  @OneToMany(() => Sesion, (sesion) => sesion.usuario)
  sesiones: Sesion[];
  @Column({
    type: 'enum',
    enum: Estado,
    array: false,
    default: Estado.ACTIVO,
  })
  estado: Estado;
  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
