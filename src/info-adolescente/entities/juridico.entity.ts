import {
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  JoinColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Delito } from './delito.entity';
import { Adolescente } from 'src/adolescente/entities/adolescente.entity';

@Entity('juridico')
export class Juridico {
  @ApiProperty({ description: 'Identificador único de Jurídico' })
  @PrimaryGeneratedColumn({ name: 'jurd__id' })
  id: number;

  @ApiProperty({
    description: 'Relación con adolescente',
    type: () => Adolescente,
  })
  @JoinColumn({ name: 'adlc__id' })
  @ManyToOne(() => Adolescente, (adolescente) => adolescente.juridico)
  adolescente: Adolescente;

  @ApiProperty({
    description: 'Relación con delito',
    type: () => Delito,
  })
  @JoinColumn({ name: 'dlto_id' })
  @ManyToOne(() => Delito, (delito) => delito.juridico, { eager: true })
  delito: Delito;

  @ApiProperty({ description: 'Número de la causa' })
  @Column({ name: 'numeroCausa', length: 31 })
  numeroCausa: string;

  @ApiProperty({ description: 'Nombre del juez' })
  @Column({ name: 'Juez', length: 63 })
  juez: string;

  @ApiProperty({ description: 'Nombre del defensor' })
  @Column({ name: 'Defensor', length: 63 })
  defensor: string;

  @ApiProperty({ description: 'Nombre del fiscal' })
  @Column({ name: 'Fiscal', length: 63 })
  fiscal: string;

  @ApiProperty({ description: 'Medidas tomadas' })
  @Column({ name: 'Medidas', length: 255 })
  medidas: string;

  @ApiProperty({ description: 'Boleta preventivo' })
  @Column({ name: 'BoletaPreventivo', length: 31 })
  boletaPreventivo: string;

  @ApiProperty({
    description: 'Fecha de inicio del proceso jurídico',
    example: '2008-05-20',
    type: String,
    format: 'date',
  })
  @Column({ name: 'fecha_inicio', type: 'date' })
  fechaInicio: Date;

  @ApiProperty({
    description: 'Fecha de inicio de la audiencia',
    example: '2008-05-20',
    type: String,
    format: 'date',
  })
  @Column({ name: 'fecha_audiencia', type: 'date' })
  fechaAudiencia: Date;

  @ApiProperty({ description: 'Boleta cárcel' })
  @Column({ name: 'BoletaCarcel', length: 31 })
  boletaCarcel: string;

  @ApiProperty({
    description: 'Fecha de la sentencia',
    example: '2008-05-20',
    type: String,
    format: 'date',
  })
  @Column({ name: 'FechaSentencia', type: 'date' })
  fechaSentencia: Date;

  @ApiProperty({ description: 'Tiempo de la sentencia (Años)' })
  @Column({ name: 'tiempoAnio', type: 'int' })
  tiempoAnio: number;

  @ApiProperty({ description: 'Tiempo de la sentencia (Meses)' })
  @Column({ name: 'tiempoMes', type: 'int' })
  tiempoMes: number;

  @ApiProperty({ description: 'Tiempo de la sentencia (Dias)' })
  @Column({ name: 'tiempoDias', type: 'int' })
  sentenciaDia: number;

  @ApiProperty({
    description: 'Fecha de fin del proceso jurídico',
    example: '2008-05-20',
    type: String,
    format: 'date',
  })
  @Column({ name: 'fecha_fin', type: 'date' })
  fechaFin: Date;

  @ApiProperty({
    description: 'Fecha 60',
    example: '2008-05-20',
    type: String,
    format: 'date',
  })
  @Column({ name: 'fecha60', type: 'date' })
  fecha60: Date;

  @ApiProperty({
    description: 'Fecha 80',
    example: '2008-05-20',
    type: String,
    format: 'date',
  })
  @Column({ name: 'fecha80', type: 'date' })
  fecha80: Date;

  @ApiProperty({ description: 'Recurso de apelación/modificatoria' })
  @Column({ name: 'RecApelMod', length: 255 })
  recApelMod: string;

  @ApiProperty({
    description: 'Fecha de la apelación/modificatoria',
    example: '2008-05-20',
    type: String,
    format: 'date',
  })
  @Column({ name: 'RecApelFecha', type: 'date' })
  RecApelFecha: Date;

  @ApiProperty({ description: 'Casacion recurso' })
  @Column({ name: 'CasacionRecurso', length: 1 })
  casacionRecurso: string;

  @ApiProperty({
    description: 'Fecha de la casacion',
    example: '2008-05-20',
    type: String,
    format: 'date',
  })
  @Column({ name: 'CasacionFecha', type: 'date' })
  casacionFecha: Date;

  @ApiProperty({
    description: 'Fecha de egreso',
    example: '2008-05-20',
    type: String,
    format: 'date',
  })
  @Column({ name: 'egresoFecha', type: 'date' })
  egresoFecha: Date;

  @ApiProperty({ description: 'Motivo de egreso' })
  @Column({ name: 'EgresoMotivo', length: 255 })
  egresoMotivo: string;
}
