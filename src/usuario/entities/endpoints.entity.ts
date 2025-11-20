import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Permiso } from './permisos.entity';

@Entity()
export class Endpoint {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  endpoint: string;
  @OneToMany(() => Permiso, (permiso) => permiso.endpoint)
  permisos: Permiso[];
}
