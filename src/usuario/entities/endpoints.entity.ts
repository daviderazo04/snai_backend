import {
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { Permiso } from './permisos.entity';

@Entity()
export class Endpoint {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  @Unique(['endpoint'])
  endpoint: string;
  @Column()
  descripcion: string;
  @OneToMany(() => Permiso, (permiso) => permiso.endpoint)
  permisos: Permiso[];
}
