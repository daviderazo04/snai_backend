// rep-infractor.entity.ts
import { Entity, ManyToOne, JoinColumn, Column } from 'typeorm';
import { Adolescente } from './adolescente.entity';
import { Representante } from './representante.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity('repInfractor')
export class RepInfractor {
  // Muchas filas de 'repInfractor' pertenecen a un Adolescente
  @ManyToOne(() => Adolescente, (adolescente) => adolescente.repInfractores)
  @JoinColumn({ name: 'adlc_id' })
  adolescente: Adolescente;

  // Muchas filas de 'repInfractor' pertenecen a un Representante
  @ManyToOne(
    () => Representante,
    (representante) => representante.repInfractores,
  )
  @JoinColumn({ name: 'repr_id' })
  representante: Representante;

  @ApiProperty({
    description: 'Fecha de inicio de representación',
    example: '2008-05-20',
  })
  @Column({ type: 'date', name: 'fechaInicio' })
  fechaInicio: Date;

  @ApiProperty({
    description: 'Fecha de fin de representación',
    example: '2018-05-20',
  })
  @Column({ type: 'date', name: 'fechaFin', nullable: true })
  fechaFin: Date | null;
}
