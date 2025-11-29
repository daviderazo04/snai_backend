// representante.entity.ts
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  ManyToOne,
} from 'typeorm';
import { RepInfractor } from './repInfractor.entity';
import { Parentesco } from 'src/parametros/entities/parentesco.entity';
import { Nacionalidad } from 'src/parametros/entities/nacionalidad.entity';
import { Canton } from 'src/localidades/entities/canton.entity';

@Entity('representante')
export class Representante {
  @PrimaryGeneratedColumn({ name: 'repr_id' }) // Mapeo al ID de tu diagrama
  id: number;

  @ManyToOne(() => Nacionalidad, (nacionalidad) => nacionalidad.representantes)
  nacionalidad: Nacionalidad;

  @ManyToOne(() => Parentesco, (parentesco) => parentesco.representantes)
  parentesco: Parentesco;

  @ManyToOne(() => Canton, (canton) => canton.representantes)
  canton: Canton;

  @Column({ length: 31 })
  nombre: string;

  @Column({ length: 31 })
  apellido: string;

  @Column({ length: 31 })
  cedula: string;

  // Un representante puede estar en múltiples registros de repInfractor (tener varios hijos)
  @OneToMany(() => RepInfractor, (repInfractor) => repInfractor.representante)
  repInfractores: RepInfractor[];
}
