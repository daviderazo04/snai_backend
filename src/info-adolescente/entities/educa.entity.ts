import { Column, Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Adolescente } from '../../adolescente/entities/adolescente.entity';
import { Estado } from 'src/common/enums/estado.enum';

@Entity('EDUCA')
export class Educa {
  @ApiProperty({ description: 'Identificador único del registro educativo' })
  @PrimaryGeneratedColumn({ name: 'EDUC__ID' })
  id: number;

  @ManyToOne(() => Adolescente, (adolescente) => adolescente.educa)
  @JoinColumn({ name: 'ADLC__ID' })
  adolescente: Adolescente;

  @ApiProperty({ description: 'Fecha de registro' })
  @Column({ type: 'date', name: 'FECHA', nullable: true })
  fecha: Date;

  @ApiProperty({ description: '¿Estudia actualmente? (0 o 1)' })
  @Column({ name: 'ESTUDIA', length: 1, nullable: true })
  estudia: string;

  @ApiProperty({ description: 'Razón por la que no estudia' })
  @Column({ name: 'RAZONNOESTUDIA', length: 255, nullable: true })
  razonNoEstudia: string;

  @ApiProperty({ description: 'Nivel educativo' })
  @Column({ name: 'NIVEL', length: 127, nullable: true })
  nivel: string;

  @ApiProperty({ description: 'Ciclo académico' })
  @Column({ name: 'CICLOACADEMICO', length: 63, nullable: true })
  cicloAcademico: string;

  @ApiProperty({ description: 'Carrera o especialidad' })
  @Column({ name: 'CARRERA', length: 127, nullable: true })
  carrera: string;

  @ApiProperty({ description: 'Nombre de la institución' })
  @Column({ name: 'INSTITUCION', length: 127, nullable: true })
  institucion: string;

  @ApiProperty({ description: 'Modalidad (Presencial/Distancia)' })
  @Column({ name: 'MODALIDAD', length: 15, nullable: true })
  modalidad: string;

  @ApiProperty({ description: 'Teléfono o contacto de la institución' })
  @Column({ name: 'CONTACTO', length: 63, nullable: true })
  contacto: string;

  @ApiProperty({ description: 'Observaciones adicionales' })
  @Column({ name: 'OBSERVACION', length: 255, nullable: true })
  observacion: string;

  @Column({
    type: 'enum',
    enum: Estado,
    default: Estado.ACTIVO,
  })
  estado: Estado;
}