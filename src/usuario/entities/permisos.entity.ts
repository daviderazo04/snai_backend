import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Endpoint } from './endpoints.entity';
import { Perfil } from './perfil.entity';

@Entity()
export class Permiso {
  @PrimaryGeneratedColumn()
  id: number;
  @ManyToOne(() => Endpoint, (endpoint) => endpoint.permisos, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'endpointId' })
  endpoint: Endpoint;

  @ManyToOne(() => Perfil, (perfil) => perfil.permisos, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'perfilId' })
  perfil: Perfil;
  @Column()
  VIEW: boolean;
  @Column()
  EDIT: boolean;
}
