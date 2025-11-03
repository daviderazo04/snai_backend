import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Role } from './usuario.roles.enum';
import { Estado } from '../../common/internalClasses/estado.enum';

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

  @Column({
    type: 'enum',
    enum: Role,
    array: true,
    default: [Role.LECTOR],
  })
  roles: Role[];
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
