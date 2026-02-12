// representante.entity.ts
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  ManyToOne,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { RepInfractor } from './repInfractor.entity';
import { Parentesco } from 'src/parametros/entities/parentesco.entity';
import { Nacionalidad } from 'src/parametros/entities/nacionalidad.entity';
import { Canton } from 'src/localidades/entities/canton.entity';

@Entity('representante')
export class Representante {
  @ApiProperty({ description: 'Identificador del representante', example: 1 })
  @PrimaryGeneratedColumn({ name: 'repr_id' }) // Mapeo al ID de tu diagrama
  id: number;

  @ApiProperty({
    description: 'Nacionalidad asociada al representante',
    type: () => Nacionalidad,
  })
  @ManyToOne(() => Nacionalidad, (nacionalidad) => nacionalidad.representantes)
  nacionalidad: Nacionalidad;

  @ApiProperty({
    description: 'Parentesco del representante con el adolescente',
    type: () => Parentesco,
  })
  @ManyToOne(() => Parentesco, (parentesco) => parentesco.representantes)
  parentesco: Parentesco;

  @ApiProperty({ description: 'Cantón de residencia', type: () => Canton })
  @ManyToOne(() => Canton, (canton) => canton.representantes)
  canton: Canton;

  @ApiProperty({ description: 'Nombre del representante', example: 'Pedro' })
  @Column({ length: 31 })
  nombre: string;

  @ApiProperty({ description: 'Apellido del representante', example: 'Gomez' })
  @Column({ length: 31 })
  apellido: string;

  @ApiProperty({ description: 'Cédula del representante', example: '1712345678' })
  @Column({ length: 31 })
  cedula: string;

  // Un representante puede estar en múltiples registros de repInfractor (tener varios hijos)
  @OneToMany(() => RepInfractor, (repInfractor) => repInfractor.representante)
  repInfractores: RepInfractor[];
}
