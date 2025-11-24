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
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class Usuario {
  @ApiProperty()
  @PrimaryGeneratedColumn()
  id: number;
  @ApiProperty()
  @Column()
  nombre: string;
  @ApiProperty()
  @Column()
  apellido: string;
  @Column({ unique: true })
  @ApiProperty()
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
  @ApiProperty({ enum: Estado })
  estado: Estado;
  @ApiProperty()
  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
