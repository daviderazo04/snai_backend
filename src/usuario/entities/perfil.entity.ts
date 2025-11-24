import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Permiso } from './permisos.entity';
import { Sesion } from './sesion.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class Perfil {
  @ApiProperty()
  @PrimaryGeneratedColumn()
  id: number;
  @ApiProperty()
  @Column()
  nombre: string;
  @ApiProperty()
  @Column()
  descripcion: string;
  @ApiProperty({ type: () => Permiso, isArray: true })
  @OneToMany(() => Permiso, (permiso) => permiso.perfil)
  permisos: Permiso[];
  @ApiProperty({ type: () => Sesion, isArray: true })
  @OneToMany(() => Sesion, (sesion) => sesion.perfil)
  sesiones: Sesion[];
}
