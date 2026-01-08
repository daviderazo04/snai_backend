import { Column, Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Adolescente } from '../../adolescente/entities/adolescente.entity';
import { Estado } from 'src/common/enums/estado.enum';

@Entity('SALUD')
export class Salud {
  @ApiProperty({ description: 'Identificador único de salud' })
  @PrimaryGeneratedColumn({ name: 'SALD__ID' })
  id: number;

  @ManyToOne(() => Adolescente, (adolescente) => adolescente.salud)
  @JoinColumn({ name: 'ADLC__ID' })
  adolescente: Adolescente;

  @Column({ type: 'date', name: 'FECHA' })
  fecha: Date;

  @Column({ name: 'DIAGNOSTICO', length: 127, nullable: true })
  diagnostico: string;

  @Column({ name: 'TOMAMEDICACION', length: 1 })
  tomaMedicacion: string;

  @Column({ name: 'CONSUMESUSTANCIA', length: 1 })
  consumeSustancia: string;

  @Column({ name: 'TIPOSUSTANCIA', length: 127, nullable: true })
  tipoSustancia: string;

  @Column({ type: 'int2', name: 'NUMATENMEDICA', default: 0 })
  numAtenMedica: number;

  @Column({ name: 'DISCAPACIDAD', length: 1 })
  discapacidad: string;

  @Column({ name: 'OBSERVACION', length: 255, nullable: true })
  observacion: string;

  @Column({ type: 'enum', enum: Estado, default: Estado.ACTIVO })
  estado: Estado;
}