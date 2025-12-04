import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Usuario } from '../../usuario/entities/usuario.entity';

@Entity()
export class Auditoria {
  @PrimaryGeneratedColumn()
  id: number;
  @ManyToOne(() => Usuario, (usuario) => usuario.auditorias)
  usuario: Usuario;
  @Column()
  endpoint: string;
  @Column()
  metodo: string;
  @Column()
  permitido: boolean;
  @Column({
    default: false,
  })
  completado: boolean;
  @Column({
    nullable: true,
  })
  antes?: string;
  @Column({
    nullable: true,
  })
  despues?: string;
  @Column({
    nullable: true,
  })
  payload?: string;
  @Column({
    nullable: true,
  })
  error?: string;
  @CreateDateColumn()
  fecha: Date;
}
